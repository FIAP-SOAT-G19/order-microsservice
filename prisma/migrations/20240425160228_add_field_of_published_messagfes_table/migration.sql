/*
  Warnings:

  - Added the required column `response` to the `published_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "published_messages" ADD COLUMN     "response" TEXT NOT NULL;
