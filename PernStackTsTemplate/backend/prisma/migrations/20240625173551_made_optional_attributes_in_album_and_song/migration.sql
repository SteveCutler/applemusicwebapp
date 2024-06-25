-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "trackCount" DROP NOT NULL,
ALTER COLUMN "releaseDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "trackNumber" DROP NOT NULL;
