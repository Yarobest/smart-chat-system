DROP INDEX IF EXISTS "AssignmentSubmission_assignmentId_studentId_key";
CREATE INDEX "AssignmentSubmission_assignmentId_studentId_submittedAt_idx"
ON "AssignmentSubmission"("assignmentId", "studentId", "submittedAt");
