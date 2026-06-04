import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, pbkdf2Sync, timingSafeEqual, createHash } from 'crypto';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { getCourseTemplates } from '../academics/course-catalog';

@Injectable()
export class AuthService {
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
    await this.enrollStudentInCourseGroups(user);
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

  private async enrollStudentInCourseGroups(user: User) {
    if (user.role !== UserRole.STUDENT) return;

    const courses = getCourseTemplates(
      user.awardType ?? undefined,
      user.programme ?? undefined,
      user.yearGroup ?? undefined,
    );

    for (const course of courses) {
      const courseKey = [
        user.awardType,
        user.programme,
        user.yearGroup,
        course.code,
      ].join('::');
      const existingConversation = await this.prisma.conversation.findFirst({
        where: { courseKey },
        select: { id: true },
      });
      const conversation =
        existingConversation ??
        (await this.prisma.conversation.create({
          data: {
            type: 'GROUP',
            title: `${course.code} · ${course.name}`,
            courseKey,
            courseCode: course.code,
            courseName: course.name,
            faculty: user.faculty,
            department: user.department,
            programme: user.programme,
            yearGroup: user.yearGroup,
            awardType: user.awardType,
          },
          select: { id: true },
        }));

      await this.prisma.conversationMember.upsert({
        where: {
          conversationId_userId: {
            conversationId: conversation.id,
            userId: user.id,
          },
        },
        update: {},
        create: {
          conversationId: conversation.id,
          userId: user.id,
        },
      });
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
