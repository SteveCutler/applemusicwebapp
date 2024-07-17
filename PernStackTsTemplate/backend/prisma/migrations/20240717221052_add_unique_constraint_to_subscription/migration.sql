/*
  Warnings:

  - A unique constraint covering the columns `[userId,podcastId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_podcastId_key" ON "Subscription"("userId", "podcastId");
