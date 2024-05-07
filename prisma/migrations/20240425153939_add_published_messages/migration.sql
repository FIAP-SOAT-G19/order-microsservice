-- CreateTable
CREATE TABLE "published_messages" (
    "id" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "published_messages_pkey" PRIMARY KEY ("id")
);
