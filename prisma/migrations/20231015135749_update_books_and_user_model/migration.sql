/*
  Warnings:

  - You are about to drop the column `booksId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Books` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_booksId_fkey";

-- DropIndex
DROP INDEX "User_booksId_key";

-- AlterTable
ALTER TABLE "Books" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "booksId";

-- CreateIndex
CREATE UNIQUE INDEX "Books_userId_key" ON "Books"("userId");

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
