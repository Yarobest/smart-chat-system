import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: User) {
    const items = await (this.prisma as any).notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return items.map((item: any) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      body: item.body,
      data: item.data,
      read: Boolean(item.readAt),
      createdAt: item.createdAt.toISOString(),
    }));
  }

  async markAllRead(user: User) {
    await (this.prisma as any).notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return { read: true };
  }
}
