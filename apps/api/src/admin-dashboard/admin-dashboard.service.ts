import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [
      totalUsers,
      students,
      lecturers,
      admins,
      onlineUsers,
      conversations,
      messages,
      recentUsers,
      recentMessages,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.STUDENT } }),
      this.prisma.user.count({ where: { role: UserRole.LECTURER } }),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
      this.prisma.user.count({ where: { isOnline: true } }),
      this.prisma.conversation.count(),
      this.prisma.message.count({ where: { deletedAt: null } }),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          faculty: true,
          department: true,
          createdAt: true,
        },
      }),
      this.prisma.message.findMany({
        where: { deletedAt: null, createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { sender: true, conversation: true },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        students,
        lecturers,
        admins,
        onlineUsers,
        conversations,
        messages,
      },
      recentUsers: recentUsers.map((user) => ({
        ...user,
        role: user.role.toLowerCase(),
        createdAt: user.createdAt.toISOString(),
      })),
      recentMessages: recentMessages.map((message) => ({
        id: message.id,
        text: message.text,
        senderName: message.sender.name,
        conversationTitle:
          message.conversation.title ?? message.conversation.type.toLowerCase(),
        createdAt: message.createdAt.toISOString(),
      })),
    };
  }
}
