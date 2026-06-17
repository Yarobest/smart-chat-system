import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: Record<string, string | undefined> = {}) {
    const search = query.search?.trim();
    const role = this.parseRole(query.role);
    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(query.faculty ? { faculty: query.faculty } : {}),
      ...(query.department ? { department: query.department } : {}),
      ...(query.programme ? { programme: query.programme } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { studentId: { contains: search, mode: 'insensitive' } },
              { staffId: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          studentId: true,
          staffId: true,
          faculty: true,
          department: true,
          programme: true,
          yearGroup: true,
          awardType: true,
          isOnline: true,
          lastSeenAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      total,
      users: users.map((user) => ({
        ...user,
        role: user.role.toLowerCase(),
        lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
      })),
    };
  }

  async findOne(id: string) {
    const [user, messages, conversations] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          studentId: true,
          staffId: true,
          faculty: true,
          department: true,
          programme: true,
          yearGroup: true,
          awardType: true,
          avatarUrl: true,
          isOnline: true,
          lastSeenAt: true,
          createdAt: true,
        },
      }),
      this.prisma.message.count({ where: { senderId: id, deletedAt: null } }),
      this.prisma.conversationMember.count({ where: { userId: id } }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        ...user,
        role: user.role.toLowerCase(),
        lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
      },
      stats: {
        messages,
        conversations,
      },
    };
  }

  private parseRole(value?: string) {
    if (!value || value === 'all') return undefined;

    const role = value.toUpperCase();
    return Object.values(UserRole).includes(role as UserRole)
      ? (role as UserRole)
      : undefined;
  }
}
