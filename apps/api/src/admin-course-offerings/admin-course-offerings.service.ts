import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminCourseOfferingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const offerings = await this.db().courseOffering.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        course: true,
        academicSession: true,
        lecturer: true,
        conversation: {
          include: { members: true },
        },
      },
    });

    return {
      offerings: offerings.map((offering) => this.toResponse(offering)),
    };
  }

  async create(body: unknown) {
    const data = this.asRecord(body);
    const courseId = this.requiredString(data.courseId, 'courseId');
    const academicYear = this.requiredString(data.academicYear, 'academicYear');
    const semester = this.parseSemester(data.semester);
    const faculty = this.requiredString(data.faculty, 'faculty');
    const department = this.requiredString(data.department, 'department');
    const programme = this.requiredString(data.programme, 'programme');
    const awardType = this.requiredString(data.awardType, 'awardType');
    const yearGroup = this.requiredString(data.yearGroup, 'yearGroup');

    const course = await this.db().course.findUnique({ where: { id: courseId } });

    if (!course) throw new NotFoundException('Course not found');
    const lecturerId = course.lecturerId;
    if (!lecturerId) {
      throw new BadRequestException('Course must have a lecturer before it can be assigned');
    }

    const lecturer = await this.db().user.findUnique({ where: { id: lecturerId } });
    if (!lecturer) throw new NotFoundException('Lecturer not found');
    if (lecturer.role !== 'LECTURER' && lecturer.role !== 'ADMIN') {
      throw new BadRequestException('Course lecturer must belong to a lecturer');
    }

    const existing = await this.db().courseOffering.findFirst({
      where: {
        courseId,
        academicSession: { academicYear, semester },
        faculty,
        department,
        programme,
        awardType,
        yearGroup,
      },
    });

    if (existing) {
      throw new ConflictException(
        'This course is already assigned for that academic year and semester',
      );
    }

    const students = await this.db().user.findMany({
      where: {
        role: 'STUDENT',
        faculty,
        department,
        programme,
        awardType,
        yearGroup,
      },
      select: { id: true },
    });

    const offering = await this.db().$transaction(async (tx: any) => {
      const academicSession = await tx.academicSession.upsert({
        where: { academicYear_semester: { academicYear, semester } },
        update: { isActive: true },
        create: { academicYear, semester },
      });

      const conversation = await tx.conversation.create({
        data: {
          type: 'GROUP',
          title: `${course.code} - ${course.name}`,
          courseKey: `${academicYear}:${semester}:${course.id}`,
          courseCode: course.code,
          courseName: course.name,
          faculty,
          department,
          programme,
          yearGroup,
          awardType,
          ownerId: lecturerId,
          members: {
            create: [
              { userId: lecturerId, role: 'OWNER' },
              ...students.map((student: { id: string }) => ({
                userId: student.id,
                role: 'MEMBER',
              })),
            ],
          },
        },
      });

      return tx.courseOffering.create({
        data: {
          courseId,
          academicSessionId: academicSession.id,
          lecturerId,
          conversationId: conversation.id,
          faculty,
          department,
          programme,
          awardType,
          yearGroup,
        },
        include: {
          course: true,
          academicSession: true,
          lecturer: true,
          conversation: { include: { members: true } },
        },
      });
    });

    return { offering: this.toResponse(offering) };
  }

  private toResponse(offering: any) {
    return {
      id: offering.id,
      status: offering.status.toLowerCase(),
      academicYear: offering.academicSession.academicYear,
      semester: this.formatSemester(offering.academicSession.semester),
      course: {
        id: offering.course.id,
        code: offering.course.code,
        name: offering.course.name,
        faculty: offering.faculty ?? offering.course.faculty,
        department: offering.department ?? offering.course.department,
        programme: offering.programme ?? offering.course.programme,
        awardType: offering.awardType ?? offering.course.awardType,
        yearGroup: offering.yearGroup ?? offering.course.yearGroup,
      },
      lecturer: {
        id: offering.lecturer.id,
        name: offering.lecturer.name,
        email: offering.lecturer.email,
      },
      group: {
        id: offering.conversationId,
        title: offering.conversation?.title ?? null,
        memberCount: offering.conversation?.members?.length ?? 0,
      },
      createdAt: offering.createdAt.toISOString(),
    };
  }

  private parseSemester(value: unknown) {
    const raw = this.requiredString(value, 'semester').toUpperCase();

    if (raw === 'SEMESTER_1' || raw === 'SEMESTER 1' || raw === '1') {
      return 'SEMESTER_1';
    }

    if (raw === 'SEMESTER_2' || raw === 'SEMESTER 2' || raw === '2') {
      return 'SEMESTER_2';
    }

    throw new BadRequestException('semester must be Semester 1 or Semester 2');
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
}
