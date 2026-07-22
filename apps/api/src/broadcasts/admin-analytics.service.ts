import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AdminAnalyticsService {
  constructor(private prisma: PrismaService) {}
  private db() {
    return this.prisma as any;
  }
  async get(u: User) {
    if (u.role !== UserRole.ADMIN)
      throw new ForbiddenException('Administrator access required');
    const since = new Date(Date.now() - 7 * 86400000);
    const [
      users,
      students,
      lecturers,
      courses,
      messages,
      submissions,
      attempts,
      materials,
      materialReads,
      announcements,
      announcementReads,
      broadcasts,
      recipients,
      readRecipients,
      recentUsers,
      recentMessages,
    ] = await Promise.all([
      this.db().user.count(),
      this.db().user.count({ where: { role: 'STUDENT' } }),
      this.db().user.count({ where: { role: 'LECTURER' } }),
      this.db().courseOffering.count({ where: { status: 'ACTIVE' } }),
      this.db().message.count({ where: { deletedAt: null } }),
      this.db().assignmentSubmission.count(),
      this.db().quizAttempt.count(),
      this.db().courseMaterial.count({ where: { status: 'PUBLISHED' } }),
      this.db().courseMaterialAccess.count({
        where: { firstOpenedAt: { not: null } },
      }),
      this.db().courseAnnouncement.count({ where: { status: 'PUBLISHED' } }),
      this.db().announcementAccess.count({ where: { readAt: { not: null } } }),
      this.db().institutionalBroadcast.count({
        where: { status: 'PUBLISHED' },
      }),
      this.db().broadcastRecipient.count(),
      this.db().broadcastRecipient.count({ where: { readAt: { not: null } } }),
      this.db().user.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      this.db().message.findMany({
        where: { createdAt: { gte: since }, deletedAt: null },
        select: { createdAt: true },
      }),
    ]);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const series = days.map((d) => {
      const next = new Date(d.getTime() + 86400000),
        within = (x: any) => x.createdAt >= d && x.createdAt < next;
      return {
        date: d.toISOString(),
        registrations: recentUsers.filter(within).length,
        messages: recentMessages.filter(within).length,
      };
    });
    return {
      stats: {
        users,
        students,
        lecturers,
        activeCourses: courses,
        messages,
        submissions,
        quizAttempts: attempts,
        publishedMaterials: materials,
        materialReads,
        publishedAnnouncements: announcements,
        announcementReads,
        publishedBroadcasts: broadcasts,
        broadcastRecipients: recipients,
        broadcastReads: readRecipients,
        broadcastReadRate: recipients
          ? Math.round((readRecipients / recipients) * 100)
          : 0,
      },
      series,
    };
  }
}
