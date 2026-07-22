CREATE TYPE "QuizStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');
CREATE TYPE "QuizQuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');
CREATE TYPE "QuizAttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'GRADED');

CREATE TABLE "Quiz" (
  "id" TEXT NOT NULL, "courseOfferingId" TEXT NOT NULL, "lecturerId" TEXT NOT NULL,
  "title" TEXT NOT NULL, "instructions" TEXT NOT NULL, "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3) NOT NULL, "durationMinutes" INTEGER NOT NULL, "maxAttempts" INTEGER NOT NULL DEFAULT 1,
  "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false, "shuffleAnswers" BOOLEAN NOT NULL DEFAULT false,
  "resultsReleased" BOOLEAN NOT NULL DEFAULT false, "status" "QuizStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QuizQuestion" (
  "id" TEXT NOT NULL, "quizId" TEXT NOT NULL, "type" "QuizQuestionType" NOT NULL,
  "text" TEXT NOT NULL, "options" JSONB, "correctAnswer" JSONB, "marks" INTEGER NOT NULL,
  "position" INTEGER NOT NULL, "explanation" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QuizAttempt" (
  "id" TEXT NOT NULL, "quizId" TEXT NOT NULL, "studentId" TEXT NOT NULL, "attemptNumber" INTEGER NOT NULL,
  "status" "QuizAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS', "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL, "submittedAt" TIMESTAMP(3), "autoScore" INTEGER NOT NULL DEFAULT 0,
  "manualScore" INTEGER NOT NULL DEFAULT 0, "totalScore" INTEGER, "resultsReleasedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QuizAnswer" (
  "id" TEXT NOT NULL, "attemptId" TEXT NOT NULL, "questionId" TEXT NOT NULL, "answer" JSONB,
  "awardedMarks" INTEGER, "feedback" TEXT, "gradedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Quiz_courseOfferingId_status_idx" ON "Quiz"("courseOfferingId", "status");
CREATE INDEX "Quiz_lecturerId_idx" ON "Quiz"("lecturerId");
CREATE INDEX "Quiz_startAt_endAt_idx" ON "Quiz"("startAt", "endAt");
CREATE UNIQUE INDEX "QuizQuestion_quizId_position_key" ON "QuizQuestion"("quizId", "position");
CREATE UNIQUE INDEX "QuizAttempt_quizId_studentId_attemptNumber_key" ON "QuizAttempt"("quizId", "studentId", "attemptNumber");
CREATE INDEX "QuizAttempt_studentId_status_idx" ON "QuizAttempt"("studentId", "status");
CREATE INDEX "QuizAttempt_quizId_status_idx" ON "QuizAttempt"("quizId", "status");
CREATE UNIQUE INDEX "QuizAnswer_attemptId_questionId_key" ON "QuizAnswer"("attemptId", "questionId");
CREATE INDEX "QuizAnswer_questionId_idx" ON "QuizAnswer"("questionId");
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "CourseOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
