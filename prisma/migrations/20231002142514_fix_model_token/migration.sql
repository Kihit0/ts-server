/*
  Warnings:

  - You are about to drop the column `emailToken` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `valid` on the `Token` table. All the data in the column will be lost.
  - Added the required column `token` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Token_emailToken_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "emailToken",
DROP COLUMN "type",
DROP COLUMN "valid",
ADD COLUMN     "token" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TokenType";
