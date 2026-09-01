ALTER TABLE "Message"
ADD COLUMN "anonymousSenderId" TEXT,
ADD COLUMN "anonymousSenderName" TEXT,
ALTER COLUMN "senderId" DROP NOT NULL;

UPDATE "Message" AS m
SET
  "anonymousSenderId" = COALESCE(m."anonymousSenderId", 'anon_' || m."id"),
  "anonymousSenderName" = COALESCE(m."anonymousSenderName", 'Anonymous ' || UPPER(RIGHT(m."id", 4))),
  "senderId" = NULL
FROM "Conversation" AS c
WHERE m."conversationId" = c."id"
  AND c."type" = 'GROUP';

CREATE INDEX "Message_anonymousSenderId_idx" ON "Message"("anonymousSenderId");
