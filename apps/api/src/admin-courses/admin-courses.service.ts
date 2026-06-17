import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminCoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const courses = await this.db().course.findMany({
      orderBy: [{ isActive: 'desc' }, { code: 'asc' }],
      include: {
        offerings: {
          include: { academicSession: true, lecturer: true, conversation: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return {
      courses: courses.map((course) => ({
        ...course,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        offerings: course.offerings.map((offering) =>
          this.toOfferingResponse(offering),
        ),
      })),
    };
  }

  async create(body: unknown) {
    const data = this.asRecord(body);
    const course = await this.db().course.create({
      data: {
        code: this.requiredString(data.code, 'code').toUpperCase(),
        name: this.requiredString(data.name, 'name'),
        description: this.optionalString(data.description),
        creditHours: this.optionalNumber(data.creditHours),
        faculty: this.requiredString(data.faculty, 'faculty'),
        department: this.requiredString(data.department, 'department'),
        programme: this.requiredString(data.programme, 'programme'),
        awardType: this.requiredString(data.awardType, 'awardType'),
        yearGroup: this.requiredString(data.yearGroup, 'yearGroup'),
      },
    });

    return {
      course: {
        ...course,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        offerings: [],
      },
    };
  }

  private toOfferingResponse(offering: any) {
    return {
      id: offering.id,
      academicYear: offering.academicSession.academicYear,
      semester: this.formatSemester(offering.academicSession.semester),
      lecturer: {
        id: offering.lecturer.id,
        name: offering.lecturer.name,
        email: offering.lecturer.email,
      },
      conversationId: offering.conversationId,
      groupTitle: offering.conversation?.title ?? null,
      status: offering.status.toLowerCase(),
      createdAt: offering.createdAt.toISOString(),
    };
  }

  private formatSemester(value: string) {
    return value === 'SEMESTER_1' ? 'Semester 1' : 'Semester 2';
  }

  private db() {
    return this.prisma as any;
  }

  private asRecord(value: unknown) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('request body must be an object');
    }

    return value as Record<string, unknown>;
  }

  private requiredString(value: unknown, field: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} is required`);
    }

    return value.trim();
  }

  private optionalString(value: unknown) {
    if (value === undefined || value === null || value === '') return undefined;
    return this.requiredString(value, 'description');
  }

  private optionalNumber(value: unknown) {
    if (value === undefined || value === null || value === '') return undefined;
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) {
      throw new BadRequestException('creditHours must be a positive number');
    }

    return number;
  }
}
