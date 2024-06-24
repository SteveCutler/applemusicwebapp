-- Add a temporary column to hold userId values
ALTER TABLE "Album" ADD COLUMN "userId_temp" TEXT;

-- Update the temporary column with appropriate userId values
-- Assuming you have a way to determine the correct userId
-- This query needs to be customized based on your actual data and requirements
UPDATE "Album" SET "userId_temp" = (
    SELECT "userId" FROM "Library" WHERE "Library"."id" = "Album"."libraryId"
);

-- Ensure all rows have been updated correctly
-- Add a check or log to verify this step

-- Drop the original foreign key constraint
ALTER TABLE "Album" DROP CONSTRAINT "Album_libraryId_fkey";

-- Drop the original column
ALTER TABLE "Album" DROP COLUMN "libraryId";

-- Rename the temporary column to the original column name
ALTER TABLE "Album" RENAME COLUMN "userId_temp" TO "userId";

-- Add the new foreign key constraint
ALTER TABLE "Album" ADD CONSTRAINT "Album_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Ensure the userId column is not null if required
-- ALTER TABLE "Album" ALTER COLUMN "userId" SET NOT NULL;

-- Drop the Library table if it is no longer needed
DROP TABLE "Library";

-- Create the Song table
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "artistName" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "durationInMillis" INTEGER NOT NULL,
    "artworkUrl" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- Create unique index on songId
CREATE UNIQUE INDEX "Song_songId_key" ON "Song"("songId");

-- Add foreign key constraint to Song table
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
