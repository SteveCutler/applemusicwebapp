/*
  Warnings:

  - Added the required column `href` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "href" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
