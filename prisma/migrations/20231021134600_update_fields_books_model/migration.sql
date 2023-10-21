/*
  Warnings:

  - You are about to drop the column `numberOfPages` on the `Books` table. All the data in the column will be lost.
  - Added the required column `pages` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" DROP COLUMN "numberOfPages",
ADD COLUMN     "pages" INTEGER NOT NULL;
