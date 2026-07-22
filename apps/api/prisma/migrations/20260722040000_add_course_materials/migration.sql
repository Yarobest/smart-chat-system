CREATE TYPE "CourseMaterialStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "CourseMaterialType" AS ENUM ('NOTES', 'SLIDES', 'READING', 'REFERENCE', 'REVISION');
CREATE TABLE "CourseMaterial" (
  "id" TEXT NOT NULL, "courseOfferingId" TEXT NOT NULL, "lecturerId" TEXT NOT NULL,
  "title" TEXT NOT NULL, "description" TEXT, "type" "CourseMaterialType" NOT NULL,
  "topic" TEXT, "files" JSONB NOT NULL, "version" INTEGER NOT NULL DEFAULT 1,
  "allowDownload" BOOLEAN NOT NULL DEFAULT true, "pinned" BOOLEAN NOT NULL DEFAULT false,
  "status" "CourseMaterialStatus" NOT NULL DEFAULT 'DRAFT', "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseMaterial_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "CourseMaterialAccess" (
  "materialId" TEXT NOT NULL, "studentId" TEXT NOT NULL, "firstOpenedAt" TIMESTAMP(3),
  "lastOpenedAt" TIMESTAMP(3), "downloadedAt" TIMESTAMP(3), "alertDismissedAt" TIMESTAMP(3),
  CONSTRAINT "CourseMaterialAccess_pkey" PRIMARY KEY ("materialId", "studentId")
);
CREATE INDEX "CourseMaterial_courseOfferingId_status_idx" ON "CourseMaterial"("courseOfferingId", "status");
CREATE INDEX "CourseMaterial_lecturerId_idx" ON "CourseMaterial"("lecturerId");
CREATE INDEX "CourseMaterial_publishedAt_idx" ON "CourseMaterial"("publishedAt");
CREATE INDEX "CourseMaterialAccess_studentId_lastOpenedAt_idx" ON "CourseMaterialAccess"("studentId", "lastOpenedAt");
ALTER TABLE "CourseMaterial" ADD CONSTRAINT "CourseMaterial_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "CourseOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseMaterial" ADD CONSTRAINT "CourseMaterial_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseMaterialAccess" ADD CONSTRAINT "CourseMaterialAccess_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "CourseMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseMaterialAccess" ADD CONSTRAINT "CourseMaterialAccess_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
