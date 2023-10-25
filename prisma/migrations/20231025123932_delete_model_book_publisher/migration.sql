/*
  Warnings:

  - You are about to drop the `Book_publisher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `publisherId` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book_publisher" DROP CONSTRAINT "Book_publisher_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Book_publisher" DROP CONSTRAINT "Book_publisher_publisherId_fkey";

-- AlterTable
ALTER TABLE "Books" ADD COLUMN     "publisherId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Book_publisher";

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
