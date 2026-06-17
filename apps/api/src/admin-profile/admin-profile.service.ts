import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const admin = await this.prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        staffId: true,
        faculty: true,
        department: true,
        avatarUrl: true,
        isOnline: true,
        lastSeenAt: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return {
        profile: null,
        message: 'No admin account exists in the database yet.',
      };
    }

    return {
      profile: {
        ...admin,
        role: admin.role.toLowerCase(),
        lastSeenAt: admin.lastSeenAt?.toISOString() ?? null,
        createdAt: admin.createdAt.toISOString(),
      },
    };
  }
}
