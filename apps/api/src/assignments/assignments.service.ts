import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignmentStatus, User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { join } from 'path';

export type AssignmentUpload = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Injectable()
export class AssignmentsService {
  private readonly uploadDirectory = join(process.cwd(), 'uploads', 'assignments');
  constructor(private readonly prisma: PrismaService) {}

  async storeFile(user: User, file?: AssignmentUpload) {
    if (!file) throw new BadRequestException('file is required');
    const allowedRoles: UserRole[] = [UserRole.LECTURER, UserRole.STUDENT];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Assignment file access is restricted');
    }
    const id = randomUUID();
    await mkdir(this.uploadDirectory, { recursive: true });
    await writeFile(join(this.uploadDirectory, id), file.buffer);
    await writeFile(
      join(this.uploadDirectory, `${id}.json`),
      JSON.stringify({ name: file.originalname, mimeType: file.mimetype, size: file.size }),
      'utf8',
    );
    return { id, name: file.originalname, uri: `/assignments/files/${id}`, type: file.mimetype, size: file.size };
  }

  async readFile(user: User, id: string) {
    if (![UserRole.LECTURER, UserRole.STUDENT, UserRole.ADMIN].includes(user.role)) {
      throw new ForbiddenException('Assignment file access is restricted');
    }
    if (!/^[a-f0-9-]{36}$/i.test(id)) throw new NotFoundException('File not found');
    try {
      const [buffer, metadata] = await Promise.all([
        readFile(join(this.uploadDirectory, id)),
        readFile(join(this.uploadDirectory, `${id}.json`), 'utf8'),
      ]);
      const details = JSON.parse(metadata) as { name: string; mimeType: string };
      return { buffer, name: details.name, mimeType: details.mimeType || 'application/octet-stream' };
    } catch {
      throw new NotFoundException('File not found');
    }
  }

  async list(user: User) {
    if (user.role === UserRole.LECTURER) {
      const assignments = await this.db().assignment.findMany({
        where: { lecturerId: user.id },
        include: this.assignmentInclude(),
        orderBy: { createdAt: 'desc' },
      });
      return assignments.map((item: any) => this.response(item, user));
    }

    if (user.role === UserRole.STUDENT) {
      const assignments = await this.db().assignment.findMany({
        where: {
          status: { in: [AssignmentStatus.PUBLISHED, AssignmentStatus.CLOSED] },
          courseOffering: {
            conversation: { members: { some: { userId: user.id } } },
          },
        },
        include: this.assignmentInclude(user.id),
        orderBy: { dueAt: 'asc' },
      });
      return assignments.map((item: any) => this.response(item, user));
    }

    const assignments = await this.db().assignment.findMany({
      include: this.assignmentInclude(),
      orderBy: { createdAt: 'desc' },
    });
    return assignments.map((item: any) => this.response(item, user));
  }

  async listCourseOfferings(user: User) {
    this.assertLecturer(user);
    const offerings = await this.db().courseOffering.findMany({
      where: { lecturerId: user.id, status: 'ACTIVE' },
      include: { course: true, academicSession: true },
      orderBy: { createdAt: 'desc' },
    });

    return offerings.map((offering: any) => ({
      id: offering.id,
      courseCode: offering.course.code,
      courseName: offering.course.name,
      academicYear: offering.academicSession.academicYear,
      semester: offering.academicSession.semester,
      programme: offering.programme,
      yearGroup: offering.yearGroup,
    }));
  }

  async create(user: User, body: unknown) {
    this.assertLecturer(user);
    const data = this.record(body);
    const courseOfferingId = this.required(data.courseOfferingId, 'courseOfferingId');
    await this.ownedOffering(user.id, courseOfferingId);

    const allowFile = this.boolean(data.allowFile, true);
    const allowText = this.boolean(data.allowText, false);
    if (!allowFile && !allowText) {
      throw new BadRequestException('At least one submission format must be enabled');
    }

    const dueAt = this.date(data.dueAt, 'dueAt');
    if (dueAt.getTime() <= Date.now()) {
      throw new BadRequestException('dueAt must be in the future');
    }

    const publish = data.publish === true;
    const assignment = await this.db().assignment.create({
      data: {
        courseOfferingId,
        lecturerId: user.id,
        title: this.required(data.title, 'title'),
        instructions: this.required(data.instructions, 'instructions'),
        dueAt,
        totalMarks: this.positiveInteger(data.totalMarks, 'totalMarks'),
        allowFile,
        allowText,
        allowLate: this.boolean(data.allowLate, false),
        allowResubmission: this.boolean(data.allowResubmission, false),
        allowedFileTypes: this.stringArray(data.allowedFileTypes),
        maxFileSizeMb: this.positiveInteger(data.maxFileSizeMb ?? 10, 'maxFileSizeMb'),
        attachments: this.attachments(data.attachments),
        status: publish ? AssignmentStatus.PUBLISHED : AssignmentStatus.DRAFT,
        publishedAt: publish ? new Date() : null,
      },
      include: this.assignmentInclude(),
    });

    if (publish) await this.notifyStudents(assignment);

    return this.response(assignment, user);
  }

  async detail(user: User, id: string) {
    const assignment = await this.findAssignment(id, user.role === UserRole.STUDENT ? user.id : undefined);
    await this.assertCanView(user, assignment);
    return this.response(assignment, user);
  }

  async update(user: User, id: string, body: unknown) {
    this.assertLecturer(user);
    const existing = await this.db().assignment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Assignment not found');
    if (existing.lecturerId !== user.id) throw new ForbiddenException('This assignment belongs to another lecturer');

    const data = this.record(body);
    const nextStatus = data.status
      ? this.assignmentStatus(data.status)
      : existing.status;
    const submissionCount = await this.db().assignmentSubmission.count({ where: { assignmentId: id } });
    this.assertStatusTransition(existing.status, nextStatus);
    const nextAllowFile = data.allowFile !== undefined ? this.boolean(data.allowFile, existing.allowFile) : existing.allowFile;
    const nextAllowText = data.allowText !== undefined ? this.boolean(data.allowText, existing.allowText) : existing.allowText;
    if (!nextAllowFile && !nextAllowText) {
      throw new BadRequestException('At least one submission format must be enabled');
    }
    if (submissionCount > 0) {
      if (data.courseOfferingId !== undefined && data.courseOfferingId !== existing.courseOfferingId) {
        throw new BadRequestException('Course cannot change after submissions exist');
      }
      if (data.totalMarks !== undefined && Number(data.totalMarks) !== existing.totalMarks) {
        throw new BadRequestException('Total marks cannot change after submissions exist');
      }
    }

    const updated = await this.db().assignment.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: this.required(data.title, 'title') } : {}),
        ...(data.instructions !== undefined ? { instructions: this.required(data.instructions, 'instructions') } : {}),
        ...(data.dueAt !== undefined ? { dueAt: this.date(data.dueAt, 'dueAt') } : {}),
        ...(data.totalMarks !== undefined ? { totalMarks: this.positiveInteger(data.totalMarks, 'totalMarks') } : {}),
        ...(data.allowFile !== undefined ? { allowFile: this.boolean(data.allowFile, existing.allowFile) } : {}),
        ...(data.allowText !== undefined ? { allowText: this.boolean(data.allowText, existing.allowText) } : {}),
        ...(data.allowLate !== undefined ? { allowLate: this.boolean(data.allowLate, false) } : {}),
        ...(data.allowResubmission !== undefined ? { allowResubmission: this.boolean(data.allowResubmission, false) } : {}),
        ...(data.attachments !== undefined ? { attachments: this.attachments(data.attachments) } : {}),
        status: nextStatus,
        ...(nextStatus === AssignmentStatus.PUBLISHED && !existing.publishedAt ? { publishedAt: new Date() } : {}),
        ...(nextStatus === AssignmentStatus.CLOSED ? { closedAt: new Date() } : {}),
        ...(nextStatus === AssignmentStatus.PUBLISHED ? { closedAt: null } : {}),
      },
      include: this.assignmentInclude(),
    });
    if (existing.status === AssignmentStatus.DRAFT && nextStatus === AssignmentStatus.PUBLISHED) {
      await this.notifyStudents(updated);
    }
    return this.response(updated, user);
  }

  async dismissAlert(user: User, id: string) {
    if (user.role !== UserRole.STUDENT) throw new ForbiddenException('Only students can dismiss assignment alerts');
    const assignment = await this.findAssignment(id, user.id);
    await this.assertCanView(user, assignment);
    await this.db().assignmentAlertDismissal.upsert({
      where: { assignmentId_studentId: { assignmentId: id, studentId: user.id } },
      create: { assignmentId: id, studentId: user.id },
      update: { dismissedAt: new Date() },
    });
    return { dismissed: true, id };
  }

  async remove(user: User, id: string) {
    this.assertLecturer(user);
    const existing = await this.db().assignment.findUnique({
      where: { id },
      include: { _count: { select: { submissions: true } } },
    });
    if (!existing) throw new NotFoundException('Assignment not found');
    if (existing.lecturerId !== user.id) throw new ForbiddenException('This assignment belongs to another lecturer');
    if (existing._count.submissions > 0) {
      throw new BadRequestException('Assignments with submissions cannot be deleted. Archive it instead.');
    }
    await this.db().assignment.delete({ where: { id } });
    return { deleted: true, id };
  }

  async submit(user: User, assignmentId: string, body: unknown) {
    if (user.role !== UserRole.STUDENT) throw new ForbiddenException('Only students can submit assignments');
    const assignment = await this.findAssignment(assignmentId, user.id);
    await this.assertCanView(user, assignment);
    if (assignment.status !== AssignmentStatus.PUBLISHED) throw new BadRequestException('Assignment is not open');

    const now = new Date();
    const late = now.getTime() > assignment.dueAt.getTime();
    if (late && !assignment.allowLate) throw new BadRequestException('The submission deadline has passed');

    const data = this.record(body);
    const textResponse = this.optional(data.textResponse);
    const attachments = this.attachments(data.attachments);
    if ((!assignment.allowText || !textResponse) && (!assignment.allowFile || attachments.length === 0)) {
      throw new BadRequestException('Provide an allowed written response or file attachment');
    }
    const oversized = attachments.find(
      (file) => typeof file.size === 'number' && file.size > assignment.maxFileSizeMb * 1024 * 1024,
    );
    if (oversized) throw new BadRequestException(`${oversized.name} exceeds the ${assignment.maxFileSizeMb} MB limit`);
    if (assignment.allowedFileTypes.length > 0) {
      const disallowed = attachments.find(
        (file) => file.type && !assignment.allowedFileTypes.includes(file.type),
      );
      if (disallowed) throw new BadRequestException(`${disallowed.name} is not an allowed file type`);
    }

    const existing = await this.db().assignmentSubmission.findFirst({
      where: { assignmentId, studentId: user.id },
      orderBy: { version: 'desc' },
    });
    if (existing && !assignment.allowResubmission) throw new BadRequestException('Resubmission is not allowed');

    const submission = await this.db().assignmentSubmission.create({
      data: {
        assignmentId,
        studentId: user.id,
        textResponse,
        attachments,
        status: late ? 'LATE' : 'SUBMITTED',
        submittedAt: now,
        version: existing ? existing.version + 1 : 1,
      },
      include: { student: true },
    });
    return this.submissionResponse(submission, user);
  }

  async listSubmissions(user: User, assignmentId: string) {
    this.assertLecturer(user);
    const assignment = await this.findAssignment(assignmentId);
    if (assignment.lecturerId !== user.id) throw new ForbiddenException('This assignment belongs to another lecturer');

    const members = assignment.courseOffering.conversation?.members ?? [];
    const submissions = await this.db().assignmentSubmission.findMany({
      where: { assignmentId },
      include: { student: true },
      orderBy: { submittedAt: 'desc' },
    });
    const byStudent = new Map<string, any[]>();
    submissions.forEach((item: any) => {
      const versions = byStudent.get(item.studentId) ?? [];
      versions.push(item);
      byStudent.set(item.studentId, versions);
    });

    return {
      assignment: this.response(assignment, user),
      students: members
        .filter((member: any) => member.user.role === UserRole.STUDENT)
        .map((member: any) => ({
          student: { id: member.user.id, name: member.user.name, studentId: member.user.studentId },
          submissions: (byStudent.get(member.user.id) ?? []).map((item) => this.submissionResponse(item, user)),
          submission: byStudent.has(member.user.id)
            ? this.submissionResponse(byStudent.get(member.user.id)![0], user)
            : null,
        })),
    };
  }

  async grade(user: User, assignmentId: string, submissionId: string, body: unknown) {
    this.assertLecturer(user);
    const assignment = await this.db().assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    if (assignment.lecturerId !== user.id) throw new ForbiddenException('This assignment belongs to another lecturer');
    const data = this.record(body);
    const score = this.nonNegativeInteger(data.score, 'score');
    if (score > assignment.totalMarks) throw new BadRequestException('score cannot exceed total marks');

    const submission = await this.db().assignmentSubmission.findFirst({
      where: { id: submissionId, assignmentId },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    const latest = await this.db().assignmentSubmission.findFirst({
      where: { assignmentId, studentId: submission.studentId },
      orderBy: { submittedAt: 'desc' },
    });
    if (!latest || latest.id !== submission.id) {
      throw new BadRequestException('Only the latest submission version can be graded');
    }

    const graded = await this.db().assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback: this.optional(data.feedback),
        graderId: user.id,
        gradedAt: new Date(),
        releasedAt: data.release === false ? null : new Date(),
        status: 'GRADED',
      },
      include: { student: true },
    });
    return this.submissionResponse(graded, user);
  }

  private assignmentInclude(studentId?: string) {
    return {
      courseOffering: {
        include: {
          course: true,
          academicSession: true,
          conversation: { include: { members: { include: { user: true } } } },
        },
      },
      lecturer: true,
      submissions: studentId
        ? { where: { studentId }, include: { student: true }, orderBy: { submittedAt: 'desc' as const } }
        : true,
      alertDismissals: studentId ? { where: { studentId } } : false,
      _count: { select: { submissions: true } },
    };
  }

  private async findAssignment(id: string, studentId?: string) {
    const assignment = await this.db().assignment.findUnique({
      where: { id },
      include: this.assignmentInclude(studentId),
    });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  private async assertCanView(user: User, assignment: any) {
    if (user.role === UserRole.ADMIN || assignment.lecturerId === user.id) return;
    const member = assignment.courseOffering.conversation?.members?.some((item: any) => item.userId === user.id);
    const studentVisibleStatus = [AssignmentStatus.PUBLISHED, AssignmentStatus.CLOSED].includes(assignment.status);
    if (user.role !== UserRole.STUDENT || !studentVisibleStatus || !member) {
      throw new ForbiddenException('You cannot access this assignment');
    }
  }

  private async ownedOffering(lecturerId: string, id: string) {
    const offering = await this.db().courseOffering.findFirst({ where: { id, lecturerId, status: 'ACTIVE' } });
    if (!offering) throw new ForbiddenException('You can only use your active course offerings');
    return offering;
  }

  private response(item: any, viewer: User) {
    const ownSubmission = viewer.role === UserRole.STUDENT ? item.submissions?.[0] : undefined;
    const releasedGrades = viewer.role === UserRole.STUDENT
      ? (item.submissions ?? []).filter((submission: any) => submission.releasedAt && submission.score !== null)
      : [];
    const bestGrade = releasedGrades.reduce(
      (best: any, submission: any) => !best || submission.score > best.score ? submission : best,
      null,
    );
    return {
      id: item.id,
      title: item.title,
      instructions: item.instructions,
      dueAt: item.dueAt.toISOString(),
      totalMarks: item.totalMarks,
      allowFile: item.allowFile,
      allowText: item.allowText,
      allowLate: item.allowLate,
      allowResubmission: item.allowResubmission,
      allowedFileTypes: item.allowedFileTypes,
      maxFileSizeMb: item.maxFileSizeMb,
      attachments: Array.isArray(item.attachments) ? item.attachments : [],
      status: item.status.toLowerCase(),
      publishedAt: item.publishedAt?.toISOString() ?? null,
      createdAt: item.createdAt.toISOString(),
      course: {
        offeringId: item.courseOffering.id,
        conversationId: item.courseOffering.conversationId,
        code: item.courseOffering.course.code,
        name: item.courseOffering.course.name,
        academicYear: item.courseOffering.academicSession.academicYear,
        semester: item.courseOffering.academicSession.semester,
      },
      lecturer: { id: item.lecturer.id, name: item.lecturer.name },
      submissionCount: item._count?.submissions ?? item.submissions?.length ?? 0,
      submission: ownSubmission ? this.submissionResponse(ownSubmission, viewer) : null,
      recordedScore: bestGrade?.score ?? null,
      recordedGradeVersion: bestGrade?.version ?? null,
      recordedFeedback: bestGrade?.feedback ?? null,
      alertDismissed: viewer.role === UserRole.STUDENT && Boolean(item.alertDismissals?.length),
    };
  }

  private async notifyStudents(assignment: any) {
    const studentIds = (assignment.courseOffering.conversation?.members ?? [])
      .filter((member: any) => member.user.role === UserRole.STUDENT)
      .map((member: any) => member.user.id);
    if (studentIds.length === 0) return;
    await this.db().notification.createMany({
      data: studentIds.map((userId: string) => ({
        userId,
        type: 'assignment_published',
        title: 'New assignment posted',
        body: `${assignment.courseOffering.course.code}: ${assignment.title}`,
        data: { assignmentId: assignment.id, conversationId: assignment.courseOffering.conversationId },
      })),
    });
  }

  private submissionResponse(item: any, viewer: User) {
    const canSeeGrade = viewer.role !== UserRole.STUDENT || Boolean(item.releasedAt);
    return {
      id: item.id,
      textResponse: item.textResponse,
      attachments: Array.isArray(item.attachments) ? item.attachments : [],
      status: item.status.toLowerCase(),
      version: item.version,
      submittedAt: item.submittedAt.toISOString(),
      score: canSeeGrade ? item.score : null,
      feedback: canSeeGrade ? item.feedback : null,
      gradedAt: canSeeGrade ? item.gradedAt?.toISOString() ?? null : null,
      releasedAt: item.releasedAt?.toISOString() ?? null,
      student: item.student ? { id: item.student.id, name: item.student.name, studentId: item.student.studentId } : undefined,
    };
  }

  private assertLecturer(user: User) {
    if (user.role !== UserRole.LECTURER) throw new ForbiddenException('Lecturer access required');
  }

  private assignmentStatus(value: unknown) {
    const status = this.required(value, 'status').toUpperCase() as AssignmentStatus;
    if (!Object.values(AssignmentStatus).includes(status)) throw new BadRequestException('Invalid assignment status');
    return status;
  }

  private assertStatusTransition(current: AssignmentStatus, next: AssignmentStatus) {
    if (current === next) return;
    const allowed: Record<AssignmentStatus, AssignmentStatus[]> = {
      [AssignmentStatus.DRAFT]: [AssignmentStatus.PUBLISHED],
      [AssignmentStatus.PUBLISHED]: [AssignmentStatus.CLOSED, AssignmentStatus.ARCHIVED],
      [AssignmentStatus.CLOSED]: [AssignmentStatus.PUBLISHED, AssignmentStatus.ARCHIVED],
      [AssignmentStatus.ARCHIVED]: [AssignmentStatus.CLOSED],
    };
    if (!allowed[current].includes(next)) {
      throw new BadRequestException(`Assignment cannot move from ${current.toLowerCase()} to ${next.toLowerCase()}`);
    }
  }

  private attachments(value: unknown) {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) throw new BadRequestException('attachments must be an array');
    return value.map((entry) => {
      const item = this.record(entry);
      return { name: this.required(item.name, 'attachment.name'), uri: this.required(item.uri, 'attachment.uri'), type: this.optional(item.type), size: typeof item.size === 'number' ? item.size : undefined };
    });
  }

  private stringArray(value: unknown) {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) throw new BadRequestException('allowedFileTypes must be an array');
    return value.map((item) => this.required(item, 'allowedFileTypes'));
  }

  private date(value: unknown, field: string) {
    const date = new Date(this.required(value, field));
    if (Number.isNaN(date.getTime())) throw new BadRequestException(`${field} must be a valid date`);
    return date;
  }

  private positiveInteger(value: unknown, field: string) {
    const number = Number(value);
    if (!Number.isInteger(number) || number <= 0) throw new BadRequestException(`${field} must be a positive integer`);
    return number;
  }

  private nonNegativeInteger(value: unknown, field: string) {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) throw new BadRequestException(`${field} must be zero or a positive integer`);
    return number;
  }

  private boolean(value: unknown, fallback: boolean) {
    return typeof value === 'boolean' ? value : fallback;
  }

  private optional(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private required(value: unknown, field: string) {
    if (typeof value !== 'string' || !value.trim()) throw new BadRequestException(`${field} is required`);
    return value.trim();
  }

  private record(value: unknown) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BadRequestException('request body must be an object');
    return value as Record<string, unknown>;
  }

  private db() {
    return this.prisma as any;
  }
}
