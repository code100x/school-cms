/*
  Warnings:

  - Added the required column `calendarNotionId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "calendarNotionId" TEXT NOT NULL;
