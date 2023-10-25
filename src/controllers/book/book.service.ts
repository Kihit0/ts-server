import { PrismaClient } from "@prisma/client";
import { IBook } from "@interfaces/root.interface";
import prisma from "@db/prisma";
import { AppError } from "@exceptions/AppError";
import { HttpCodes } from "@enums/HttpStatusCode";

export class BookService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  public async getAllBook(
    startIndex: number | undefined,
    maxResult: number | undefined
  ): Promise<IBook[]> {
    if (maxResult !== undefined && maxResult > 60) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Max result not to exceed 60",
      });
    }

    const allBook: IBook[] | null = await this.prisma.books.findMany({
      skip: startIndex !== undefined ? startIndex : 0,
      take: maxResult !== undefined ? maxResult : 30,
    });

    if (!allBook) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Books not found",
      });
    }

    return allBook;
  }

  public async getBookById(id: number): Promise<IBook> {
    const book: IBook | null = await this.prisma.books.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Book not found",
      });
    }

    return book;
  }

  public async getBookByISNB(isbn: string): Promise<IBook> {
    const book: IBook | null = await this.prisma.books.findUnique({
      where: {
        isbn,
      },
    });

    if (!book) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Book not found",
      });
    }
    
    return book;
  }
}
