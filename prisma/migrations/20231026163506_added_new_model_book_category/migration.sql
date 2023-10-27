/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Books` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_categoryId_fkey";

-- AlterTable
ALTER TABLE "Books" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "Book_category" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Book_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Book_category" ADD CONSTRAINT "Book_category_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_category" ADD CONSTRAINT "Book_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
