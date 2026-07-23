import { BadRequestException, Injectable } from '@nestjs/common';
import { ConversationType, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const BROADCAST_COURSE_KEY = 'SYSTEM_BROADCASTS';
const BROADCAST_TITLE = 'Campus Broadcasts';

type BroadcastInput = {
  title?: string;
  message?: string;
  audience?: string;
  priority?: string;
};

type BroadcastMetadata = {
  kind?: string;
  title?: string;
  audience?: string;
  priority?: string;
  delivered?: number;
  read?: number;
};

@Injectable()
export class AdminBroadcastsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const conversation = await this.prisma.conversation.findFirst({
      where: { courseKey: BROADCAST_COURSE_KEY },
      select: { id: true },
    });

    if (!conversation) {
      return { broadcasts: [] };
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId: conversation.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { sender: true },
    });

    return { broadcasts: messages.map((message) => this.toBroadcast(message)) };
  }

  async create(input: BroadcastInput, adminId: string) {
    const title = input.title?.trim();
    const message = input.message?.trim();
    const audience = input.audience?.trim() || 'All Campus';
    const priority = input.priority?.trim() || 'Normal';

    if (!title) {
      throw new BadRequestException('Broadcast title is required');
    }

    if (!message) {
      throw new BadRequestException('Broadcast message is required');
    }

    const conversation = await this.getBroadcastConversation(adminId);
    const delivered = await this.countAudience(audience);

    const created = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: adminId,
        text: message,
        metadata: {
          kind: 'broadcast',
          title,
          audience,
          priority,
          delivered,
          read: 0,
        },
      },
      include: { sender: true },
    });

    return this.toBroadcast(created);
  }

  private async getBroadcastConversation(adminId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: { courseKey: BROADCAST_COURSE_KEY },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.conversation.create({
      data: {
        type: ConversationType.GROUP,
        title: BROADCAST_TITLE,
        courseKey: BROADCAST_COURSE_KEY,
        ownerId: adminId,
      },
    });
  }

  private countAudience(audience: string) {
    if (audience === 'Students Only') {
      return this.prisma.user.count({ where: { role: UserRole.STUDENT } });
    }

    if (audience === 'Lecturers Only') {
      return this.prisma.user.count({ where: { role: UserRole.LECTURER } });
    }

    return this.prisma.user.count();
  }

  private toBroadcast(
    message: Prisma.MessageGetPayload<{ include: { sender: true } }>,
  ) {
    const metadata = this.asBroadcastMetadata(message.metadata);
    const delivered = metadata.delivered ?? 0;
    const read = metadata.read ?? 0;

    return {
      id: message.id,
      title: metadata.title ?? 'Campus Broadcast',
      message: message.text,
      audience: metadata.audience ?? 'All Campus',
      priority: metadata.priority ?? 'Normal',
      delivered,
      read,
      readRate: delivered > 0 ? Math.round((read / delivered) * 100) : 0,
      sentBy: message.sender.name,
      createdAt: message.createdAt.toISOString(),
    };
  }

  private asBroadcastMetadata(value: Prisma.JsonValue): BroadcastMetadata {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as BroadcastMetadata;
  }
}
