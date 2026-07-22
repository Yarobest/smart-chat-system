import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}
  private db() { return this.prisma as any; }
  private record(v: unknown) { if (!v || typeof v !== 'object' || Array.isArray(v)) throw new BadRequestException('Request body must be an object'); return v as Record<string, any>; }
  private text(v: unknown, name: string) { if (typeof v !== 'string' || !v.trim()) throw new BadRequestException(`${name} is required`); return v.trim(); }
  private int(v: unknown, name: string) { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new BadRequestException(`${name} must be a positive integer`); return n; }
  private date(v: unknown, name: string) { const d = new Date(this.text(v, name)); if (Number.isNaN(d.getTime())) throw new BadRequestException(`${name} is invalid`); return d; }
  private lecturer(u: User) { if (u.role !== UserRole.LECTURER) throw new ForbiddenException('Lecturer access required'); }

  private include(studentId?: string) {
    return {
      courseOffering: { include: { course: true, academicSession: true, conversation: { include: { members: { include: { user: true } } } } } },
      lecturer: true,
      questions: { orderBy: { position: 'asc' } },
      attempts: studentId ? { where: { studentId }, include: { answers: true }, orderBy: { attemptNumber: 'desc' } } : false,
      _count: { select: { attempts: true } },
    };
  }

  async offerings(user: User) {
    this.lecturer(user);
    const rows = await this.db().courseOffering.findMany({ where: { lecturerId: user.id, status: 'ACTIVE' }, include: { course: true, academicSession: true } });
    return rows.map((o: any) => ({ id: o.id, courseCode: o.course.code, courseName: o.course.name, academicYear: o.academicSession.academicYear, semester: o.academicSession.semester }));
  }

  async list(user: User) {
    const where = user.role === UserRole.LECTURER
      ? { lecturerId: user.id }
      : user.role === UserRole.STUDENT
        ? { status: { in: ['PUBLISHED', 'CLOSED'] }, courseOffering: { conversation: { members: { some: { userId: user.id } } } } }
        : {};
    const rows = await this.db().quiz.findMany({ where, include: this.include(user.role === UserRole.STUDENT ? user.id : undefined), orderBy: { createdAt: 'desc' } });
    return rows.map((q: any) => this.response(q, user));
  }

  async create(user: User, body: unknown) {
    this.lecturer(user); const b = this.record(body);
    const offering = await this.db().courseOffering.findFirst({ where: { id: this.text(b.courseOfferingId, 'courseOfferingId'), lecturerId: user.id, status: 'ACTIVE' } });
    if (!offering) throw new ForbiddenException('Course offering is unavailable');
    const startAt = this.date(b.startAt, 'startAt'); const endAt = this.date(b.endAt, 'endAt');
    if (endAt <= startAt) throw new BadRequestException('Closing time must be after opening time');
    const questions = this.questions(b.questions ?? []);
    const publish = b.publish === true;
    if (publish && questions.length === 0) throw new BadRequestException('Add at least one question before publishing');
    const quiz = await this.db().quiz.create({ data: {
      courseOfferingId: offering.id, lecturerId: user.id, title: this.text(b.title, 'title'), instructions: this.text(b.instructions, 'instructions'),
      startAt, endAt, durationMinutes: this.int(b.durationMinutes, 'durationMinutes'), maxAttempts: this.int(b.maxAttempts ?? 1, 'maxAttempts'),
      shuffleQuestions: b.shuffleQuestions === true, shuffleAnswers: b.shuffleAnswers === true,
      status: publish ? 'PUBLISHED' : 'DRAFT', publishedAt: publish ? new Date() : null,
      questions: { create: questions },
    }, include: this.include() });
    if (publish) await this.notify(quiz);
    return this.response(quiz, user);
  }

  async detail(user: User, id: string) {
    const q = await this.db().quiz.findUnique({ where: { id }, include: this.include(user.role === UserRole.STUDENT ? user.id : undefined) });
    if (!q) throw new NotFoundException('Quiz not found'); await this.canView(user, q); return this.response(q, user);
  }

  async update(user: User, id: string, body: unknown) {
    this.lecturer(user); const b = this.record(body);
    const current = await this.db().quiz.findUnique({ where: { id }, include: { _count: { select: { attempts: true } } } });
    if (!current) throw new NotFoundException('Quiz not found'); if (current.lecturerId !== user.id) throw new ForbiddenException('Quiz belongs to another lecturer');
    const status = b.status ? this.text(b.status, 'status').toUpperCase() : current.status;
    if (!['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'].includes(status)) throw new BadRequestException('Invalid quiz status');
    if (status === 'PUBLISHED') {
      const count = await this.db().quizQuestion.count({ where: { quizId: id } });
      if (!count) throw new BadRequestException('Add at least one question before publishing');
    }
    const questionChanges = b.questions !== undefined ? this.questions(b.questions) : null;
    if (current._count.attempts > 0 && questionChanges) {
      throw new BadRequestException('Questions cannot change after a student starts the quiz');
    }
    const updated = await this.db().quiz.update({ where: { id }, data: {
      ...(b.title !== undefined ? { title: this.text(b.title, 'title') } : {}), ...(b.instructions !== undefined ? { instructions: this.text(b.instructions, 'instructions') } : {}),
      ...(b.startAt !== undefined ? { startAt: this.date(b.startAt, 'startAt') } : {}), ...(b.endAt !== undefined ? { endAt: this.date(b.endAt, 'endAt') } : {}),
      ...(b.durationMinutes !== undefined ? { durationMinutes: this.int(b.durationMinutes, 'durationMinutes') } : {}),
      status, ...(status === 'PUBLISHED' && !current.publishedAt ? { publishedAt: new Date() } : {}),
      ...(questionChanges ? { questions: { deleteMany: {}, create: questionChanges } } : {}),
    }, include: this.include() });
    if (current.status === 'DRAFT' && status === 'PUBLISHED') await this.notify(updated);
    return this.response(updated, user);
  }

  async remove(user: User, id: string) {
    this.lecturer(user);
    const quiz = await this.db().quiz.findUnique({ where: { id }, include: { _count: { select: { attempts: true } } } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.lecturerId !== user.id) throw new ForbiddenException('Quiz belongs to another lecturer');
    if (quiz._count.attempts > 0) throw new BadRequestException('Quizzes with attempts cannot be deleted. Archive the quiz instead.');
    await this.db().quiz.delete({ where: { id } });
    return { deleted: true, id };
  }

  async start(user: User, id: string) {
    if (user.role !== UserRole.STUDENT) throw new ForbiddenException('Student access required');
    const q = await this.db().quiz.findUnique({ where: { id }, include: this.include(user.id) }); if (!q) throw new NotFoundException('Quiz not found'); await this.canView(user, q);
    const now = new Date(); if (q.status !== 'PUBLISHED' || now < q.startAt || now > q.endAt) throw new BadRequestException('Quiz is not currently available');
    const existing = q.attempts.find((a: any) => a.status === 'IN_PROGRESS'); if (existing) return this.attemptResponse(q, existing, user);
    if (q.attempts.length >= q.maxAttempts) throw new BadRequestException('No attempts remaining');
    const expiresAt = new Date(Math.min(now.getTime() + q.durationMinutes * 60000, q.endAt.getTime()));
    const attempt = await this.db().quizAttempt.create({ data: { quizId: id, studentId: user.id, attemptNumber: q.attempts.length + 1, expiresAt }, include: { answers: true } });
    return this.attemptResponse(q, attempt, user);
  }

  async answer(user: User, attemptId: string, body: unknown) {
    if (user.role !== UserRole.STUDENT) throw new ForbiddenException('Student access required'); const b = this.record(body);
    const attempt = await this.db().quizAttempt.findUnique({ where: { id: attemptId }, include: { quiz: true } });
    if (!attempt || attempt.studentId !== user.id) throw new NotFoundException('Attempt not found');
    if (attempt.status !== 'IN_PROGRESS' || new Date() >= attempt.expiresAt) throw new BadRequestException('Attempt is no longer editable');
    const question = await this.db().quizQuestion.findFirst({ where: { id: this.text(b.questionId, 'questionId'), quizId: attempt.quizId } }); if (!question) throw new NotFoundException('Question not found');
    return this.db().quizAnswer.upsert({ where: { attemptId_questionId: { attemptId, questionId: question.id } }, create: { attemptId, questionId: question.id, answer: b.answer ?? null }, update: { answer: b.answer ?? null } });
  }

  async submit(user: User, attemptId: string) {
    if (user.role !== UserRole.STUDENT) throw new ForbiddenException('Student access required');
    const a = await this.db().quizAttempt.findUnique({ where: { id: attemptId }, include: { quiz: { include: { questions: true } }, answers: true } });
    if (!a || a.studentId !== user.id) throw new NotFoundException('Attempt not found'); if (a.status !== 'IN_PROGRESS') return a;
    const byQuestion = new Map(a.answers.map((x: any) => [x.questionId, x])); let autoScore = 0; let hasManual = false;
    for (const q of a.quiz.questions) {
      const answer: any = byQuestion.get(q.id); if (q.type === 'SHORT_ANSWER') { hasManual = true; continue; }
      const correct = JSON.stringify(answer?.answer ?? null) === JSON.stringify(q.correctAnswer);
      const marks = correct ? q.marks : 0; autoScore += marks;
      if (answer) await this.db().quizAnswer.update({ where: { id: answer.id }, data: { awardedMarks: marks, gradedAt: new Date() } });
    }
    const submitted = await this.db().quizAttempt.update({ where: { id: a.id }, data: { status: hasManual ? 'SUBMITTED' : 'GRADED', submittedAt: new Date(), autoScore, totalScore: hasManual ? null : autoScore }, include: { answers: true } });
    return this.attemptResponse(a.quiz, submitted, user);
  }

  async attempts(user: User, id: string) {
    this.lecturer(user); const quiz = await this.db().quiz.findUnique({ where: { id }, include: { questions: { orderBy: { position: 'asc' } }, attempts: { include: { student: true, answers: { include: { question: true } } }, orderBy: { submittedAt: 'desc' } } } });
    if (!quiz) throw new NotFoundException('Quiz not found'); if (quiz.lecturerId !== user.id) throw new ForbiddenException('Quiz belongs to another lecturer'); return quiz;
  }

  async grade(user: User, quizId: string, attemptId: string, answerId: string, body: unknown) {
    this.lecturer(user); const b = this.record(body); const marks = Number(b.marks);
    const answer = await this.db().quizAnswer.findFirst({ where: { id: answerId, attemptId, attempt: { quizId, quiz: { lecturerId: user.id } } }, include: { question: true } });
    if (!answer) throw new NotFoundException('Answer not found'); if (answer.question.type !== 'SHORT_ANSWER') throw new BadRequestException('Only short answers require manual grading');
    if (!Number.isInteger(marks) || marks < 0 || marks > answer.question.marks) throw new BadRequestException('Invalid awarded marks');
    await this.db().quizAnswer.update({ where: { id: answer.id }, data: { awardedMarks: marks, feedback: typeof b.feedback === 'string' ? b.feedback.trim() : null, gradedAt: new Date() } });
    const attempt = await this.db().quizAttempt.findUnique({ where: { id: attemptId }, include: { answers: true, quiz: { include: { questions: true } } } });
    const shortIds = attempt.quiz.questions.filter((q: any) => q.type === 'SHORT_ANSWER').map((q: any) => q.id);
    const graded = attempt.answers.filter((x: any) => shortIds.includes(x.questionId) && x.awardedMarks !== null);
    const manualScore = graded.reduce((sum: number, x: any) => sum + x.awardedMarks, 0); const complete = graded.length === shortIds.length;
    return this.db().quizAttempt.update({ where: { id: attemptId }, data: { manualScore, ...(complete ? { status: 'GRADED', totalScore: attempt.autoScore + manualScore } : {}) } });
  }

  async release(user: User, id: string) {
    this.lecturer(user); const quiz = await this.db().quiz.findUnique({ where: { id } }); if (!quiz) throw new NotFoundException('Quiz not found'); if (quiz.lecturerId !== user.id) throw new ForbiddenException('Quiz belongs to another lecturer');
    const ungraded = await this.db().quizAttempt.count({ where: { quizId: id, status: 'SUBMITTED' } }); if (ungraded) throw new BadRequestException('Grade all short answers before releasing results');
    await this.db().$transaction([this.db().quiz.update({ where: { id }, data: { resultsReleased: true } }), this.db().quizAttempt.updateMany({ where: { quizId: id, status: 'GRADED' }, data: { resultsReleasedAt: new Date() } })]);
    return { released: true };
  }

  private questions(v: unknown) {
    if (!Array.isArray(v)) throw new BadRequestException('questions must be an array');
    return v.map((raw, i) => { const q = this.record(raw); const type = this.text(q.type, 'question.type').toUpperCase(); if (!['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'].includes(type)) throw new BadRequestException('Invalid question type');
      const options = type === 'TRUE_FALSE' ? ['True', 'False'] : type === 'MULTIPLE_CHOICE' ? q.options : null;
      if (type === 'MULTIPLE_CHOICE' && (!Array.isArray(options) || options.length < 2)) throw new BadRequestException('Multiple choice questions need at least two options');
      return { type, text: this.text(q.text, 'question.text'), options, correctAnswer: type === 'SHORT_ANSWER' ? null : q.correctAnswer, marks: this.int(q.marks, 'question.marks'), position: i + 1, explanation: typeof q.explanation === 'string' ? q.explanation.trim() : null };
    });
  }

  private async canView(user: User, q: any) {
    if (user.role === UserRole.ADMIN || q.lecturerId === user.id) return;
    const member = q.courseOffering.conversation?.members?.some((m: any) => m.userId === user.id);
    if (user.role !== UserRole.STUDENT || !['PUBLISHED', 'CLOSED'].includes(q.status) || !member) throw new ForbiddenException('You cannot access this quiz');
  }

  private response(q: any, user: User) {
    const attempts = user.role === UserRole.STUDENT ? q.attempts ?? [] : []; const latest = attempts[0]; const totalMarks = q.questions.reduce((s: number, x: any) => s + x.marks, 0);
    return { id: q.id, title: q.title, instructions: q.instructions, startAt: q.startAt.toISOString(), endAt: q.endAt.toISOString(), durationMinutes: q.durationMinutes, maxAttempts: q.maxAttempts, shuffleQuestions: q.shuffleQuestions, shuffleAnswers: q.shuffleAnswers, status: q.status.toLowerCase(), resultsReleased: q.resultsReleased, totalMarks, questionCount: q.questions.length, attemptCount: q._count?.attempts ?? 0,
      course: { offeringId: q.courseOffering.id, conversationId: q.courseOffering.conversationId, code: q.courseOffering.course.code, name: q.courseOffering.course.name },
      questions: q.questions.map((x: any) => ({ id: x.id, type: x.type.toLowerCase(), text: x.text, options: x.options ?? [], marks: x.marks, position: x.position, ...(user.role !== UserRole.STUDENT ? { correctAnswer: x.correctAnswer } : {}) })),
      attempt: latest ? this.attemptResponse(q, latest, user) : null, attemptsUsed: attempts.length };
  }

  private attemptResponse(q: any, a: any, user: User) { const released = Boolean(a.resultsReleasedAt); return { id: a.id, attemptNumber: a.attemptNumber, status: a.status.toLowerCase(), startedAt: a.startedAt.toISOString(), expiresAt: a.expiresAt.toISOString(), submittedAt: a.submittedAt?.toISOString() ?? null, answers: a.answers ?? [], score: user.role !== UserRole.STUDENT || released ? a.totalScore : null, resultsReleased: released }; }

  private async notify(q: any) { const ids = (q.courseOffering.conversation?.members ?? []).filter((m: any) => m.user.role === UserRole.STUDENT).map((m: any) => m.user.id); if (!ids.length) return;
    await this.db().notification.createMany({ data: ids.map((userId: string) => ({ userId, type: 'quiz_published', title: 'New quiz published', body: `${q.courseOffering.course.code}: ${q.title}`, data: { quizId: q.id, conversationId: q.courseOffering.conversationId } })) }); }
}
