import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Conversation,
  ConversationMemberRole,
  ConversationType,
  Message,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  private readonly typingByConversation = new Map<
    string,
    Map<string, { name: string; expiresAt: number }>
  >();

  constructor(private readonly prisma: PrismaService) {}

  async listConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: { user: true },
          orderBy: { joinedAt: 'asc' },
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const visibleConversations = conversations.filter(
      (conversation) =>
        conversation.type !== ConversationType.DIRECT ||
        conversation.messages.length > 0,
    );

    return Promise.all(
      visibleConversations.map(async (conversation) => {
        const currentMember = conversation.members.find(
          (member) => member.userId === userId,
        );
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conversation.id,
            senderId: { not: userId },
            deletedAt: null,
            createdAt: currentMember?.lastReadAt
              ? { gt: currentMember.lastReadAt }
              : undefined,
          },
        });

        return {
          ...this.toConversationResponse(conversation, userId),
          unreadCount,
          lastMessage: conversation.messages[0]
            ? this.toMessageResponse(conversation.messages[0])
            : null,
        };
      }),
    );
  }

  async searchUsers(userId: string, query: unknown) {
    const data = this.asOptionalRecord(query);
    const search = this.optionalString(data.search);
    const faculty = this.optionalString(data.faculty);
    const department = this.optionalString(data.department);
    const programme = this.optionalString(data.programme);
    const yearGroup = this.optionalString(data.yearGroup);
    const awardType = this.optionalString(data.awardType);

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
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
        ...(faculty ? { faculty } : {}),
        ...(department ? { department } : {}),
        ...(programme ? { programme } : {}),
        ...(yearGroup ? { yearGroup } : {}),
        ...(awardType ? { awardType } : {}),
      },
      orderBy: { name: 'asc' },
      take: 30,
    });

    return users.map((user) => this.toPublicUser(user));
  }

  async findOrCreateDirectConversation(userId: string, body: unknown) {
    const targetUserId = this.requiredString(
      this.asRecord(body).userId,
      'userId',
    );

    if (targetUserId === userId) {
      throw new BadRequestException('Cannot create a direct chat with yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const directKey = this.directKey(userId, targetUserId);
    const conversation = await this.prisma.conversation.upsert({
      where: { directKey },
      update: {},
      create: {
        type: ConversationType.DIRECT,
        directKey,
        members: {
          create: [
            { userId, role: ConversationMemberRole.MEMBER },
            { userId: targetUserId, role: ConversationMemberRole.MEMBER },
          ],
        },
      },
      include: {
        members: {
          include: { user: true },
          orderBy: { joinedAt: 'asc' },
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return this.toConversationResponse(conversation, userId);
  }

  async createGroupConversation(ownerId: string, body: unknown) {
    const data = this.asRecord(body);
    const title = this.requiredString(data.title, 'title');
    const memberIds = this.parseStringArray(data.memberIds, 'memberIds');
    const uniqueMemberIds = [...new Set(memberIds.filter((id) => id !== ownerId))];

    if (uniqueMemberIds.length === 0) {
      throw new BadRequestException('memberIds must include at least one user');
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: uniqueMemberIds } },
      select: { id: true },
    });

    if (users.length !== uniqueMemberIds.length) {
      throw new BadRequestException('One or more memberIds are invalid');
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: ConversationType.GROUP,
        title,
        ownerId,
        members: {
          create: [
            { userId: ownerId, role: ConversationMemberRole.OWNER },
            ...uniqueMemberIds.map((memberId) => ({
              userId: memberId,
              role: ConversationMemberRole.MEMBER,
            })),
          ],
        },
      },
      include: {
        members: {
          include: { user: true },
          orderBy: { joinedAt: 'asc' },
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return this.toConversationResponse(conversation, ownerId);
  }

  async listMessages(userId: string, conversationId: string) {
    await this.assertMember(userId, conversationId);

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
    const members = await this.prisma.conversationMember.findMany({
      where: { conversationId },
      select: { userId: true, lastReadAt: true },
    });

    await this.prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: { lastReadAt: new Date() },
    });

    return messages.map((message) =>
      this.toMessageResponse(
        message,
        members
          .filter((member) => member.userId !== message.senderId)
          .some(
            (member) =>
              member.lastReadAt &&
              member.lastReadAt.getTime() >= message.createdAt.getTime(),
          ),
      ),
    );
  }

  async sendMessage(userId: string, conversationId: string, body: unknown) {
    await this.assertMember(userId, conversationId);

    const data = this.asRecord(body);
    const text = this.optionalString(data.text) ?? '';
    const attachments = this.parseAttachments(data.attachments);

    if (!text && attachments.length === 0) {
      throw new BadRequestException('text or attachments are required');
    }

    const message = await this.prisma.$transaction(async (tx) => {
      const createdMessage = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          text,
          metadata:
            attachments.length > 0
              ? { attachments }
              : undefined,
        },
        include: { sender: true },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return createdMessage;
    });

    return this.toMessageResponse(message);
  }

  async setTyping(userId: string, conversationId: string) {
    await this.assertMember(userId, conversationId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    const users =
      this.typingByConversation.get(conversationId) ??
      new Map<string, { name: string; expiresAt: number }>();

    users.set(userId, {
      name: user?.name ?? 'Someone',
      expiresAt: Date.now() + 3500,
    });
    this.typingByConversation.set(conversationId, users);

    return { ok: true };
  }

  async listTyping(userId: string, conversationId: string) {
    await this.assertMember(userId, conversationId);

    const users = this.typingByConversation.get(conversationId);
    if (!users) {
      return { users: [] };
    }

    const now = Date.now();
    const activeUsers = [...users.entries()]
      .filter(([typingUserId, value]) => {
        const active = value.expiresAt > now;
        if (!active) users.delete(typingUserId);

        return active && typingUserId !== userId;
      })
      .map(([id, value]) => ({ id, name: value.name }));

    return { users: activeUsers };
  }

  private async assertMember(userId: string, conversationId: string) {
    const member = await this.prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      select: { id: true },
    });

    if (!member) {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { id: true },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }

      throw new ForbiddenException('You are not a member of this conversation');
    }
  }

  private toConversationResponse(
    conversation: Conversation & {
      members: Array<{ role: ConversationMemberRole; user: User; joinedAt: Date }>;
    },
    currentUserId: string,
  ) {
    const otherMembers = conversation.members.filter(
      (member) => member.user.id !== currentUserId,
    );
    const directUser = conversation.type === ConversationType.DIRECT
      ? otherMembers[0]?.user
      : null;

    return {
      id: conversation.id,
      type: conversation.type.toLowerCase(),
      title: conversation.title ?? directUser?.name ?? 'Direct chat',
      courseCode: conversation.courseCode,
      courseName: conversation.courseName,
      faculty: conversation.faculty,
      department: conversation.department,
      programme: conversation.programme,
      yearGroup: conversation.yearGroup,
      awardType: conversation.awardType,
      memberCount: conversation.members.length,
      members: conversation.members.map((member) => ({
        role: member.role.toLowerCase(),
        joinedAt: member.joinedAt.toISOString(),
        user: this.toPublicUser(member.user),
      })),
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    };
  }

  private toMessageResponse(message: Message & { sender: User }, seen = false) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      text: message.text,
      sender: this.toPublicUser(message.sender),
      senderId: message.senderId,
      attachments: this.getAttachments(message.metadata),
      seen,
      editedAt: message.editedAt?.toISOString() ?? null,
      createdAt: message.createdAt.toISOString(),
    };
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      studentId: user.studentId,
      staffId: user.staffId,
      faculty: user.faculty,
      department: user.department,
      programme: user.programme,
      yearGroup: user.yearGroup,
      awardType: user.awardType,
      avatarUrl: user.avatarUrl,
      isOnline: user.isOnline,
      lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
    };
  }

  private directKey(firstUserId: string, secondUserId: string) {
    return [firstUserId, secondUserId].sort().join(':');
  }

  private parseStringArray(value: unknown, field: string) {
    if (!Array.isArray(value)) {
      throw new BadRequestException(`${field} must be an array`);
    }

    const items = value.map((item) => this.requiredString(item, field));
    if (items.length === 0) {
      throw new BadRequestException(`${field} cannot be empty`);
    }

    return items;
  }

  private requiredString(value: unknown, field: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} is required`);
    }

    return value.trim();
  }

  private optionalString(value: unknown) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return this.requiredString(value, 'filter');
  }

  private parseAttachments(value: unknown) {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      throw new BadRequestException('attachments must be an array');
    }

    return value.map((item) => {
      const attachment = this.asRecord(item);

      return {
        type: this.requiredString(attachment.type, 'attachment.type'),
        name: this.requiredString(attachment.name, 'attachment.name'),
        mimeType: this.optionalString(attachment.mimeType),
        size:
          typeof attachment.size === 'number' && Number.isFinite(attachment.size)
            ? attachment.size
            : undefined,
        uri: this.optionalString(attachment.uri),
      };
    });
  }

  private getAttachments(metadata: unknown) {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      return [];
    }

    const attachments = (metadata as Record<string, unknown>).attachments;

    return Array.isArray(attachments) ? attachments : [];
  }

  private asRecord(value: unknown) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('request body must be an object');
    }

    return value as Record<string, unknown>;
  }

  private asOptionalRecord(value: unknown) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }
}
