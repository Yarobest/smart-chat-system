import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class BroadcastsService implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setInterval>;
  constructor(private prisma: PrismaService) {}
  private db() {
    return this.prisma as any;
  }
  onModuleInit() {
    this.timer = setInterval(() => void this.publishDue(), 30000);
    void this.publishDue();
  }
  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
  private admin(u: User) {
    if (u.role !== UserRole.ADMIN)
      throw new ForbiddenException('Administrator access required');
  }
  private obj(v: unknown) {
    if (!v || typeof v !== 'object' || Array.isArray(v))
      throw new BadRequestException('Request body must be an object');
    return v as Record<string, any>;
  }
  private required(v: any, n: string) {
    if (typeof v !== 'string' || !v.trim())
      throw new BadRequestException(`${n} is required`);
    return v.trim();
  }
  private files(v: any) {
    if (!Array.isArray(v))
      throw new BadRequestException('attachments must be an array');
    return v.map((x) => {
      const f = this.obj(x);
      return {
        name: this.required(f.name, 'file.name'),
        uri: this.required(f.uri, 'file.uri'),
        type: typeof f.type === 'string' ? f.type : null,
        size: typeof f.size === 'number' ? f.size : null,
      };
    });
  }
  private audience(b: Record<string, any>) {
    const role = b.audienceRole
      ? String(b.audienceRole).toUpperCase()
      : undefined;
    if (role && !['STUDENT', 'LECTURER', 'ADMIN'].includes(role))
      throw new BadRequestException('Invalid audience role');
    return {
      ...(role ? { role } : {}),
      ...(b.faculty ? { faculty: String(b.faculty) } : {}),
      ...(b.department ? { department: String(b.department) } : {}),
      ...(b.programme ? { programme: String(b.programme) } : {}),
      ...(b.yearGroup ? { yearGroup: String(b.yearGroup) } : {}),
    };
  }
  private include(userId?: string) {
    return { creator: true, recipients: userId ? { where: { userId } } : true };
  }
  async audienceCount(u: User, input: unknown) {
    this.admin(u);
    const b = this.obj(input);
    return { count: await this.db().user.count({ where: this.audience(b) }) };
  }
  async list(u: User) {
    await this.publishDue();
    const where =
      u.role === UserRole.ADMIN
        ? {}
        : {
            recipients: { some: { userId: u.id } },
            status: { in: ['PUBLISHED', 'ARCHIVED'] },
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          };
    const rows = await this.db().institutionalBroadcast.findMany({
      where,
      include: this.include(u.role === UserRole.ADMIN ? undefined : u.id),
      orderBy: [
        { pinned: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return rows.map((x: any) => this.response(x, u));
  }
  async create(u: User, input: unknown) {
    this.admin(u);
    const b = this.obj(input),
      priority = String(b.priority ?? 'NORMAL').toUpperCase();
    if (!['NORMAL', 'IMPORTANT', 'URGENT'].includes(priority))
      throw new BadRequestException('Invalid priority');
    const action = String(b.action ?? 'draft').toLowerCase();
    const scheduledAt =
      action === 'schedule'
        ? new Date(this.required(b.scheduledAt, 'scheduledAt'))
        : null;
    if (scheduledAt && scheduledAt.getTime() <= Date.now())
      throw new BadRequestException('Schedule time must be in the future');
    const audience = this.audience(b);
    const row = await this.db().institutionalBroadcast.create({
      data: {
        creatorId: u.id,
        title: this.required(b.title, 'title'),
        body: this.required(b.body, 'body'),
        priority,
        attachments: this.files(b.attachments ?? []),
        pinned: b.pinned === true,
        audienceLabel: this.required(b.audienceLabel, 'audienceLabel'),
        audienceRole: audience.role,
        faculty: audience.faculty,
        department: audience.department,
        programme: audience.programme,
        yearGroup: audience.yearGroup,
        status: action === 'schedule' ? 'SCHEDULED' : 'DRAFT',
        scheduledAt,
        expiresAt: b.expiresAt ? new Date(b.expiresAt) : null,
      },
      include: this.include(),
    });
    if (action === 'publish') return this.publish(u, row.id);
    return this.response(row, u);
  }
  async detail(u: User, id: string) {
    await this.publishDue();
    const row = await this.db().institutionalBroadcast.findUnique({
      where: { id },
      include: this.include(u.role === UserRole.ADMIN ? undefined : u.id),
    });
    if (!row) throw new NotFoundException('Broadcast not found');
    if (u.role !== UserRole.ADMIN && !row.recipients.length)
      throw new ForbiddenException('You cannot access this broadcast');
    return this.response(row, u);
  }
  async update(u: User, id: string, input: unknown) {
    this.admin(u);
    const b = this.obj(input),
      current = await this.db().institutionalBroadcast.findUnique({
        where: { id },
      });
    if (!current) throw new NotFoundException('Broadcast not found');
    const status = b.status ? String(b.status).toUpperCase() : current.status;
    if (!['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'].includes(status))
      throw new BadRequestException('Invalid status');
    const priority = b.priority
      ? String(b.priority).toUpperCase()
      : current.priority;
    const audience = b.audienceLabel ? this.audience(b) : {};
    const row = await this.db().institutionalBroadcast.update({
      where: { id },
      data: {
        ...(b.title !== undefined
          ? { title: this.required(b.title, 'title') }
          : {}),
        ...(b.body !== undefined
          ? { body: this.required(b.body, 'body') }
          : {}),
        ...(b.attachments !== undefined
          ? { attachments: this.files(b.attachments) }
          : {}),
        ...(b.pinned !== undefined ? { pinned: b.pinned === true } : {}),
        ...(b.audienceLabel
          ? {
              audienceLabel: this.required(b.audienceLabel, 'audienceLabel'),
              audienceRole: audience.role ?? null,
              faculty: audience.faculty ?? null,
              department: audience.department ?? null,
              programme: audience.programme ?? null,
              yearGroup: audience.yearGroup ?? null,
            }
          : {}),
        priority,
        status,
        ...(b.scheduledAt !== undefined
          ? { scheduledAt: b.scheduledAt ? new Date(b.scheduledAt) : null }
          : {}),
        ...(b.expiresAt !== undefined
          ? { expiresAt: b.expiresAt ? new Date(b.expiresAt) : null }
          : {}),
      },
      include: this.include(),
    });
    return this.response(row, u);
  }
  async publish(u: User, id: string) {
    this.admin(u);
    return this.publishById(id, u);
  }
  private async publishById(id: string, u?: User) {
    const current = await this.db().institutionalBroadcast.findUnique({
      where: { id },
    });
    if (!current) throw new NotFoundException('Broadcast not found');
    if (current.status === 'PUBLISHED')
      return this.detail(u ?? ({ role: UserRole.ADMIN } as User), id);
    const where = this.audience(current);
    const users = await this.db().user.findMany({
        where,
        select: { id: true },
      }),
      now = new Date();
    await this.db().$transaction([
      this.db().institutionalBroadcast.update({
        where: { id },
        data: { status: 'PUBLISHED', publishedAt: now, scheduledAt: null },
      }),
      this.db().broadcastRecipient.createMany({
        data: users.map((x: any) => ({
          broadcastId: id,
          userId: x.id,
          deliveredAt: now,
        })),
        skipDuplicates: true,
      }),
      this.db().notification.createMany({
        data: users.map((x: any) => ({
          userId: x.id,
          type: 'broadcast_published',
          title:
            current.priority === 'URGENT'
              ? 'Urgent institutional broadcast'
              : 'New institutional broadcast',
          body: current.title,
          data: { broadcastId: id },
        })),
      }),
    ]);
    return this.detail(u ?? ({ role: UserRole.ADMIN } as User), id);
  }
  async remove(u: User, id: string) {
    this.admin(u);
    const row = await this.db().institutionalBroadcast.findUnique({
      where: { id },
      include: { recipients: { take: 1 } },
    });
    if (!row) throw new NotFoundException('Broadcast not found');
    if (row.recipients.length)
      throw new BadRequestException(
        'Delivered broadcasts cannot be deleted. Archive it instead.',
      );
    await this.db().institutionalBroadcast.delete({ where: { id } });
    return { deleted: true, id };
  }
  async read(u: User, id: string) {
    const recipient = await this.db().broadcastRecipient.findUnique({
      where: { broadcastId_userId: { broadcastId: id, userId: u.id } },
    });
    if (!recipient)
      throw new ForbiddenException('You cannot access this broadcast');
    await this.db().broadcastRecipient.update({
      where: { broadcastId_userId: { broadcastId: id, userId: u.id } },
      data: { readAt: recipient.readAt ?? new Date() },
    });
    return { read: true };
  }
  async dismiss(u: User, id: string) {
    const recipient = await this.db().broadcastRecipient.findUnique({
      where: { broadcastId_userId: { broadcastId: id, userId: u.id } },
    });
    if (!recipient)
      throw new ForbiddenException('You cannot access this broadcast');
    await this.db().broadcastRecipient.update({
      where: { broadcastId_userId: { broadcastId: id, userId: u.id } },
      data: { alertDismissedAt: new Date() },
    });
    return { dismissed: true };
  }
  private async publishDue() {
    const due = await this.db()
      .institutionalBroadcast.findMany({
        where: { status: 'SCHEDULED', scheduledAt: { lte: new Date() } },
        select: { id: true },
      })
      .catch(() => []);
    for (const x of due) await this.publishById(x.id).catch(() => undefined);
  }
  private response(x: any, u: User) {
    const mine = u.role === UserRole.ADMIN ? null : x.recipients?.[0],
      all = x.recipients ?? [];
    return {
      id: x.id,
      title: x.title,
      body: x.body,
      priority: x.priority.toLowerCase(),
      attachments: x.attachments,
      pinned: x.pinned,
      audienceLabel: x.audienceLabel,
      audienceRole: x.audienceRole?.toLowerCase() ?? null,
      faculty: x.faculty,
      department: x.department,
      programme: x.programme,
      yearGroup: x.yearGroup,
      status: x.status.toLowerCase(),
      scheduledAt: x.scheduledAt?.toISOString() ?? null,
      publishedAt: x.publishedAt?.toISOString() ?? null,
      expiresAt: x.expiresAt?.toISOString() ?? null,
      createdAt: x.createdAt.toISOString(),
      updatedAt: x.updatedAt.toISOString(),
      creator: { id: x.creator.id, name: x.creator.name },
      recipientCount: all.length,
      readCount: all.filter((r: any) => r.readAt).length,
      isRead: Boolean(mine?.readAt),
      alertDismissed: Boolean(mine?.alertDismissedAt),
    };
  }
}
