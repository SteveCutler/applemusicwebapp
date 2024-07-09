/*
  Warnings:

  - A unique constraint covering the columns `[audioUrl]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Episode_audioUrl_key" ON "Episode"("audioUrl");
