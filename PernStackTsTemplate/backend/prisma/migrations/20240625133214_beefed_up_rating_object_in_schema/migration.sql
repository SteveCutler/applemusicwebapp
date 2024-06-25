/*
  Warnings:

  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_pkey",
ADD COLUMN     "albumName" TEXT,
ADD COLUMN     "artistName" TEXT,
ADD COLUMN     "artworkUrl" TEXT,
ADD COLUMN     "songName" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "ratedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Rating_id_seq";
