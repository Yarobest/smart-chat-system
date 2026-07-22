CREATE TYPE "AnnouncementStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "AnnouncementPriority" AS ENUM ('NORMAL', 'IMPORTANT', 'URGENT');
CREATE TABLE "CourseAnnouncement" (
  "id" TEXT NOT NULL, "courseOfferingId" TEXT NOT NULL, "lecturerId" TEXT NOT NULL,
  "title" TEXT NOT NULL, "body" TEXT NOT NULL, "priority" "AnnouncementPriority" NOT NULL DEFAULT 'NORMAL',
  "attachments" JSONB NOT NULL, "pinned" BOOLEAN NOT NULL DEFAULT false,
  "status" "AnnouncementStatus" NOT NULL DEFAULT 'DRAFT', "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseAnnouncement_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AnnouncementAccess" (
  "announcementId" TEXT NOT NULL, "studentId" TEXT NOT NULL, "readAt" TIMESTAMP(3), "alertDismissedAt" TIMESTAMP(3),
  CONSTRAINT "AnnouncementAccess_pkey" PRIMARY KEY ("announcementId", "studentId")
);
CREATE INDEX "CourseAnnouncement_courseOfferingId_status_idx" ON "CourseAnnouncement"("courseOfferingId", "status");
CREATE INDEX "CourseAnnouncement_lecturerId_idx" ON "CourseAnnouncement"("lecturerId");
CREATE INDEX "CourseAnnouncement_publishedAt_idx" ON "CourseAnnouncement"("publishedAt");
CREATE INDEX "AnnouncementAccess_studentId_readAt_idx" ON "AnnouncementAccess"("studentId", "readAt");
ALTER TABLE "CourseAnnouncement" ADD CONSTRAINT "CourseAnnouncement_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "CourseOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseAnnouncement" ADD CONSTRAINT "CourseAnnouncement_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AnnouncementAccess" ADD CONSTRAINT "AnnouncementAccess_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "CourseAnnouncement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnnouncementAccess" ADD CONSTRAINT "AnnouncementAccess_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
