/*
  Warnings:

  - You are about to drop the column `authorId` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `publisherId` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Books` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seriasId]` on the table `Books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_publisherId_fkey";

-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_userId_fkey";

-- DropIndex
DROP INDEX "Books_authorId_key";

-- DropIndex
DROP INDEX "Books_categoryId_key";

-- DropIndex
DROP INDEX "Books_publisherId_key";

-- DropIndex
DROP INDEX "Books_userId_key";

-- AlterTable
ALTER TABLE "Books" DROP COLUMN "authorId",
DROP COLUMN "publisherId",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book_author" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Book_author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book_publisher" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "publisherId" INTEGER NOT NULL,

    CONSTRAINT "Book_publisher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_key" ON "Favorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_bookId_key" ON "Favorite"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_author_bookId_key" ON "Book_author"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_author_authorId_key" ON "Book_author"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_publisher_bookId_key" ON "Book_publisher"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_publisher_publisherId_key" ON "Book_publisher"("publisherId");

-- CreateIndex
CREATE UNIQUE INDEX "Books_seriasId_key" ON "Books"("seriasId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_author" ADD CONSTRAINT "Book_author_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_author" ADD CONSTRAINT "Book_author_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_publisher" ADD CONSTRAINT "Book_publisher_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_publisher" ADD CONSTRAINT "Book_publisher_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
