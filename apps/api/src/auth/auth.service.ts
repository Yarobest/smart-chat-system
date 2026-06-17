import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, pbkdf2Sync, timingSafeEqual, createHash } from 'crypto';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly passwordIterations = 120000;
  private readonly sessionDays = 30;

  constructor(private readonly prisma: PrismaService) {}

  async register(body: unknown) {
    const input = this.parseRegisterBody(body);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    await this.assertIdentifierAvailable(input.studentId, 'studentId');
    await this.assertIdentifierAvailable(input.staffId, 'staffId');

    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: this.hashPassword(input.password),
        role: input.role,
        studentId: input.studentId,
        staffId: input.staffId,
        faculty: input.faculty,
        department: input.department,
        programme: input.programme,
        yearGroup: input.yearGroup,
        awardType: input.awardType,
      },
    });
    await this.syncStudentCourseGroups(user);
    const token = await this.createSession(user.id);

    return {
      token,
      user: this.toPublicUser(user),
    };
  }

  async login(body: unknown) {
    const input = this.parseLoginBody(body);
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !this.verifyPassword(input.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.syncStudentCourseGroups(user);
    const token = await this.createSession(user.id);

    return {
      token,
      user: this.toPublicUser(user),
    };
  }

  async logout(token?: string) {
    if (!token) {
      return { ok: true };
    }

    await this.prisma.authSession.updateMany({
      where: {
        refreshTokenHash: this.hashToken(token),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { ok: true };
  }

  async authenticate(token?: string) {
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const session = await this.prisma.authSession.findUnique({
      where: { refreshTokenHash: this.hashToken(token) },
      include: { user: true },
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return session;
  }

  toPublicUser(user: User) {
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
      createdAt: user.createdAt.toISOString(),
    };
  }

  private async createSession(userId: string) {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(
      Date.now() + this.sessionDays * 24 * 60 * 60 * 1000,
    );

    await this.prisma.authSession.create({
      data: {
        userId,
        refreshTokenHash: this.hashToken(token),
        expiresAt,
      },
    });

    return token;
  }

  private async addStudentToMatchingCourseGroups(user: User) {
    if (
      user.role !== UserRole.STUDENT ||
      !user.faculty ||
      !user.department ||
      !user.programme ||
      !user.awardType ||
      !user.yearGroup
    ) {
      return;
    }

    const offerings = await this.db().courseOffering.findMany({
      where: {
        status: 'ACTIVE',
        conversationId: { not: null },
        OR: [
          {
            faculty: user.faculty,
            department: user.department,
            programme: user.programme,
            awardType: user.awardType,
            yearGroup: user.yearGroup,
          },
          {
            conversation: {
              faculty: user.faculty,
              department: user.department,
              programme: user.programme,
              awardType: user.awardType,
              yearGroup: user.yearGroup,
            },
          },
          {
            course: {
              faculty: user.faculty,
              department: user.department,
              programme: user.programme,
              awardType: user.awardType,
              yearGroup: user.yearGroup,
            },
          },
        ],
      },
      select: { conversationId: true },
    });

    const conversationIds = offerings
      .map((offering: { conversationId: string | null }) => offering.conversationId)
      .filter((conversationId: string | null): conversationId is string => Boolean(conversationId));

    if (!conversationIds.length) return;

    await this.db().conversationMember.createMany({
      data: conversationIds.map((conversationId: string) => ({
        conversationId,
        userId: user.id,
        role: 'MEMBER',
      })),
      skipDuplicates: true,
    });
  }

  private async syncStudentCourseGroups(user: User) {
    try {
      await this.addStudentToMatchingCourseGroups(user);
    } catch (error) {
      this.logger.warn(
        `Could not sync course groups for user ${user.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private parseRegisterBody(body: unknown) {
    const data = this.asRecord(body);
    const name = this.requiredString(data.name, 'name');
    const email = this.requiredEmail(data.email);
    const password = this.requiredPassword(data.password);
    const confirmPassword = this.requiredString(
      data.confirmPassword,
      'confirmPassword',
    );
    const role = this.parseRole(data.role);
    const studentId =
      role === UserRole.STUDENT
        ? this.requiredString(data.studentId, 'studentId')
        : this.optionalString(data.studentId);
    const staffId =
      role === UserRole.LECTURER
        ? this.requiredString(data.staffId, 'staffId')
        : this.optionalString(data.staffId);
    const faculty =
      role === UserRole.STUDENT || role === UserRole.LECTURER
        ? this.requiredString(data.faculty, 'faculty')
        : this.optionalString(data.faculty);
    const department =
      role === UserRole.STUDENT || role === UserRole.LECTURER
        ? this.requiredString(data.department, 'department')
        : this.optionalString(data.department);
    const programme =
      role === UserRole.STUDENT
        ? this.requiredString(data.programme, 'programme')
        : this.optionalString(data.programme);
    const yearGroup =
      role === UserRole.STUDENT
        ? this.requiredString(data.yearGroup, 'yearGroup')
        : this.optionalString(data.yearGroup);
    const awardType =
      role === UserRole.STUDENT
        ? this.requiredAwardType(data.awardType)
        : this.optionalString(data.awardType);

    if (password !== confirmPassword) {
      throw new BadRequestException('password and confirmPassword must match');
    }

    return {
      name,
      email,
      password,
      role,
      studentId,
      staffId,
      faculty,
      department,
      programme,
      yearGroup,
      awardType,
    };
  }

  private db() {
    return this.prisma as any;
  }

  private parseLoginBody(body: unknown) {
    const data = this.asRecord(body);
    const email = this.requiredEmail(data.email);
    const password = this.requiredString(data.password, 'password');

    return { email, password };
  }

  private parseRole(value: unknown) {
    if (value === undefined || value === null || value === '') {
      return UserRole.STUDENT;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('role must be a string');
    }

    const role = value.trim().toUpperCase();
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException('role must be student, lecturer, or admin');
    }

    return role as UserRole;
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('base64url');
    const hash = pbkdf2Sync(
      password,
      salt,
      this.passwordIterations,
      32,
      'sha256',
    ).toString('base64url');

    return `pbkdf2_sha256$${this.passwordIterations}$${salt}$${hash}`;
  }

  private verifyPassword(password: string, storedHash: string) {
    const [algorithm, iterations, salt, hash] = storedHash.split('$');
    if (algorithm !== 'pbkdf2_sha256' || !iterations || !salt || !hash) {
      return false;
    }

    const candidate = pbkdf2Sync(
      password,
      salt,
      Number(iterations),
      32,
      'sha256',
    );
    const expected = Buffer.from(hash, 'base64url');

    return (
      candidate.length === expected.length &&
      timingSafeEqual(candidate, expected)
    );
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private requiredEmail(value: unknown) {
    const email = this.requiredString(value, 'email').toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('email must be valid');
    }

    return email;
  }

  private requiredPassword(value: unknown) {
    const password = this.requiredString(value, 'password');
    if (password.length < 8) {
      throw new BadRequestException('password must be at least 8 characters');
    }

    return password;
  }

  private requiredAwardType(value: unknown) {
    const awardType = this.requiredString(value, 'awardType');
    if (!['HND', 'BTech'].includes(awardType)) {
      throw new BadRequestException('awardType must be HND or BTech');
    }

    return awardType;
  }

  private optionalString(value: unknown) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('optional fields must be strings');
    }

    return value.trim();
  }

  private async assertIdentifierAvailable(
    value: string | undefined,
    field: 'studentId' | 'staffId',
  ) {
    if (!value) return;

    const existingUser = await this.prisma.user.findFirst({
      where: { [field]: value },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException(`${field} is already registered`);
    }
  }

  private requiredString(value: unknown, field: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} is required`);
    }

    return value.trim();
  }

  private asRecord(value: unknown) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('request body must be an object');
    }

    return value as Record<string, unknown>;
  }
}
