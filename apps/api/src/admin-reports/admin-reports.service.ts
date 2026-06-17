import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [
      usersByRole,
      usersByFaculty,
      usersByDepartment,
      conversationsByType,
      messagesByConversation,
    ] = await Promise.all([
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.user.groupBy({ by: ['faculty'], _count: { _all: true } }),
      this.prisma.user.groupBy({
        by: ['department'],
        _count: { _all: true },
      }),
      this.prisma.conversation.groupBy({
        by: ['type'],
        _count: { _all: true },
      }),
      this.prisma.message.groupBy({
        by: ['conversationId'],
        where: { deletedAt: null },
        _count: { _all: true },
        orderBy: { _count: { conversationId: 'desc' } },
        take: 8,
      }),
    ]);

    const conversationIds = messagesByConversation.map(
      (item) => item.conversationId,
    );
    const conversations = await this.prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
      select: { id: true, title: true, type: true, courseCode: true },
    });
    const conversationById = new Map(
      conversations.map((conversation) => [conversation.id, conversation]),
    );

    return {
      usersByRole: usersByRole.map((item) => ({
        label: item.role.toLowerCase(),
        value: item._count._all,
      })),
      usersByFaculty: usersByFaculty
        .filter((item) => item.faculty)
        .map((item) => ({ label: item.faculty, value: item._count._all })),
      usersByDepartment: usersByDepartment
        .filter((item) => item.department)
        .map((item) => ({ label: item.department, value: item._count._all })),
      conversationsByType: conversationsByType.map((item) => ({
        label: item.type.toLowerCase(),
        value: item._count._all,
      })),
      topConversations: messagesByConversation.map((item) => {
        const conversation = conversationById.get(item.conversationId);

        return {
          id: item.conversationId,
          title:
            conversation?.title ??
            conversation?.courseCode ??
            conversation?.type.toLowerCase() ??
            'Conversation',
          messages: item._count._all,
        };
      }),
    };
  }
}
