CREATE TYPE "BroadcastStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "BroadcastPriority" AS ENUM ('NORMAL', 'IMPORTANT', 'URGENT');
CREATE TABLE "InstitutionalBroadcast" (
  "id" TEXT NOT NULL, "creatorId" TEXT NOT NULL, "title" TEXT NOT NULL, "body" TEXT NOT NULL,
  "priority" "BroadcastPriority" NOT NULL DEFAULT 'NORMAL', "attachments" JSONB NOT NULL,
  "pinned" BOOLEAN NOT NULL DEFAULT false, "audienceLabel" TEXT NOT NULL, "audienceRole" "UserRole",
  "faculty" TEXT, "department" TEXT, "programme" TEXT, "yearGroup" TEXT,
  "status" "BroadcastStatus" NOT NULL DEFAULT 'DRAFT', "scheduledAt" TIMESTAMP(3),
  "publishedAt" TIMESTAMP(3), "expiresAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "InstitutionalBroadcast_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "BroadcastRecipient" (
  "broadcastId" TEXT NOT NULL, "userId" TEXT NOT NULL, "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt" TIMESTAMP(3), "alertDismissedAt" TIMESTAMP(3), CONSTRAINT "BroadcastRecipient_pkey" PRIMARY KEY ("broadcastId", "userId")
);
CREATE INDEX "InstitutionalBroadcast_status_scheduledAt_idx" ON "InstitutionalBroadcast"("status", "scheduledAt");
CREATE INDEX "InstitutionalBroadcast_creatorId_idx" ON "InstitutionalBroadcast"("creatorId");
CREATE INDEX "InstitutionalBroadcast_publishedAt_idx" ON "InstitutionalBroadcast"("publishedAt");
CREATE INDEX "BroadcastRecipient_userId_readAt_idx" ON "BroadcastRecipient"("userId", "readAt");
ALTER TABLE "InstitutionalBroadcast" ADD CONSTRAINT "InstitutionalBroadcast_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BroadcastRecipient" ADD CONSTRAINT "BroadcastRecipient_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "InstitutionalBroadcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BroadcastRecipient" ADD CONSTRAINT "BroadcastRecipient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
