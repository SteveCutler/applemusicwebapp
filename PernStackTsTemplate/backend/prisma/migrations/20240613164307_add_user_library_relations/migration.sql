/*
  Warnings:

  - You are about to drop the `Podcast` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PodcastEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Track` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PodcastEpisode" DROP CONSTRAINT "PodcastEpisode_podcastId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "libraryId" TEXT;

-- DropTable
DROP TABLE "Podcast";

-- DropTable
DROP TABLE "PodcastEpisode";

-- DropTable
DROP TABLE "Track";

-- CreateTable
CREATE TABLE "Library" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "artworkUrl" TEXT NOT NULL,
    "trackCount" INTEGER NOT NULL,
    "libraryId" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Library_userId_key" ON "Library"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_albumId_key" ON "Album"("albumId");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
