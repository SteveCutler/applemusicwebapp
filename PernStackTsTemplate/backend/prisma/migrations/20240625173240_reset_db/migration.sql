/*
  Warnings:

  - Added the required column `releaseDate` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "dateAdded" TEXT,
ADD COLUMN     "genreNames" TEXT[],
ADD COLUMN     "releaseDate" TEXT NOT NULL,
ALTER COLUMN "href" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "catalogId" TEXT;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "catalogId" TEXT;
