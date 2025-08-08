/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Purchases` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Purchases_userId_courseId_key" ON "public"."Purchases"("userId", "courseId");
