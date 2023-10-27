/*
  Warnings:

  - You are about to drop the column `lname` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `sname` on the `Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "lname",
DROP COLUMN "sname";
