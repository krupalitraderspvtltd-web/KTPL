CREATE TYPE "ChatMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

CREATE TYPE "ChatLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED');

CREATE TYPE "ChatLeadRequirement" AS ENUM ('GENERAL', 'PRODUCT', 'EXPORT', 'IMPORT', 'QUOTATION');

CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "visitorName" TEXT,
    "visitorEmail" TEXT,
    "visitorPhone" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "ChatMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatLead" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT,
    "companyName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "requirement" "ChatLeadRequirement" NOT NULL DEFAULT 'GENERAL',
    "productName" TEXT,
    "quantity" TEXT,
    "message" TEXT,
    "status" "ChatLeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChatLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatbotKnowledge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT,
    "answer" TEXT NOT NULL,
    "keywords" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChatbotKnowledge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ChatSession_sessionToken_key"
ON "ChatSession"("sessionToken");

CREATE INDEX "ChatSession_createdAt_idx"
ON "ChatSession"("createdAt");

CREATE INDEX "ChatSession_updatedAt_idx"
ON "ChatSession"("updatedAt");

CREATE INDEX "ChatMessage_sessionId_idx"
ON "ChatMessage"("sessionId");

CREATE INDEX "ChatMessage_createdAt_idx"
ON "ChatMessage"("createdAt");

CREATE UNIQUE INDEX "ChatLead_sessionId_key"
ON "ChatLead"("sessionId");

CREATE INDEX "ChatLead_status_idx"
ON "ChatLead"("status");

CREATE INDEX "ChatLead_requirement_idx"
ON "ChatLead"("requirement");

CREATE INDEX "ChatLead_createdAt_idx"
ON "ChatLead"("createdAt");

CREATE INDEX "ChatbotKnowledge_locale_idx"
ON "ChatbotKnowledge"("locale");

CREATE INDEX "ChatbotKnowledge_isActive_idx"
ON "ChatbotKnowledge"("isActive");

CREATE INDEX "ChatbotKnowledge_priority_idx"
ON "ChatbotKnowledge"("priority");

ALTER TABLE "ChatMessage"
ADD CONSTRAINT "ChatMessage_sessionId_fkey"
FOREIGN KEY ("sessionId")
REFERENCES "ChatSession"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ChatLead"
ADD CONSTRAINT "ChatLead_sessionId_fkey"
FOREIGN KEY ("sessionId")
REFERENCES "ChatSession"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;