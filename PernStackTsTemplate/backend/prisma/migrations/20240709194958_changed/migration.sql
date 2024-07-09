/*
  Warnings:

  - A unique constraint covering the columns `[userId,episodeId]` on the table `ListenedEpisode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListenedEpisode_userId_episodeId_key" ON "ListenedEpisode"("userId", "episodeId");
