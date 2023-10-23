-- DropForeignKey
ALTER TABLE "Book_author" DROP CONSTRAINT "Book_author_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Book_author" DROP CONSTRAINT "Book_author_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Book_publisher" DROP CONSTRAINT "Book_publisher_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Book_publisher" DROP CONSTRAINT "Book_publisher_publisherId_fkey";

-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_seriasId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_seriasId_fkey" FOREIGN KEY ("seriasId") REFERENCES "Serias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_author" ADD CONSTRAINT "Book_author_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_author" ADD CONSTRAINT "Book_author_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_publisher" ADD CONSTRAINT "Book_publisher_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_publisher" ADD CONSTRAINT "Book_publisher_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
