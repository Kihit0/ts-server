import { PrismaClient } from "@prisma/client";
import {
  IBook,
  ICategory,
  IPublisher,
  ISerias,
} from "@interfaces/root.interface";
import prisma from "@db/prisma";
import { AppError } from "@exceptions/AppError";
import { HttpCodes } from "@enums/HttpStatusCode";

export class BookService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  private async getAuthor(bookId: number): Promise<object[]> {
    interface IBookAuthor {
      id: number;
      bookId: number;
      authorId: number;
    }

    const authorBook: IBookAuthor | null =
      await this.prisma.book_author.findFirst({
        where: {
          bookId,
        },
      });

    if (!authorBook) {
      return [];
    }

    const authors: any[] = new Array();

    authors.push(
      await this.prisma.author.findUnique({
        where: {
          id: authorBook.authorId,
        },
      })
    );

    return authors;
  }

  private async getCategory(bookId: number): Promise<ICategory[]> {
    interface IBookCategory {
      id: number;
      bookId: number;
      categoryId: number;
    }
    const categoryArray: IBookCategory[] | null =
      await this.prisma.book_category.findMany({
        where: {
          bookId: bookId,
        },
      });

    if (!categoryArray) {
      return [];
    }

    const frontCategory: ICategory[] = new Array();

    for (let i = 0; i < categoryArray.length; i++) {
      const category: ICategory | null = await this.prisma.category.findUnique({
        where: {
          id: categoryArray[i].categoryId,
        },
      });
      category && frontCategory.push(category);
    }

    return frontCategory;
  }

  private async getPublisher(publisherId: number): Promise<IPublisher | null> {
    return await this.prisma.publisher.findUnique({
      where: {
        id: publisherId,
      },
    });
  }

  private async getSerias(seriasId: number): Promise<ISerias | null> {
    return await this.prisma.serias.findUnique({
      where: {
        id: seriasId,
      },
    });
  }

  private async getBookWithCategoryAndAuthor(book: any): Promise<any> {
    if (Array.isArray(book) && book.length !== 0) {
      for (let i = 0; i < book.length; i++) {
        const author: object[] = await this.getAuthor(book[i].id);
        const category: ICategory[] = await this.getCategory(book[i].id);
        const publisher: IPublisher | null = await this.getPublisher(
          book[i].publisherId
        );
        const serias: ISerias | null = await this.getSerias(book[i].seriasId);

        const { publisherId, seriasId, ...rest } = book[i];

        Object.assign(rest, { category, author, publisher, serias });
        book[i] = rest;
      }
      return book;
    } else if (!Array.isArray(book)) {
      const author: object[] = await this.getAuthor(book.id);
      const category: ICategory[] = await this.getCategory(book.id);
      const publisher: IPublisher | null = await this.getPublisher(
        book.publisherId
      );
      const serias: ISerias | null = await this.getSerias(book.seriasId);

      Object.assign(book, { category, author, publisher, serias });
      const { publisherId, seriasId, ...rest } = book;

      return rest;
    }

    return [];
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

    const newBooksWithCategoryAndAuthor: IBook[] =
      await this.getBookWithCategoryAndAuthor(allBook);

    return newBooksWithCategoryAndAuthor;
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

    const bookWithCategoryAndAuthor: IBook =
      await this.getBookWithCategoryAndAuthor(book);

    return bookWithCategoryAndAuthor;
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

    const newBookWithCategoryAndAuthor: IBook =
      await this.getBookWithCategoryAndAuthor(book);

    return newBookWithCategoryAndAuthor;
  }

  private async getBookByCategory(
    categoryId: number,
    maxResult?: number,
    startIndex?: number
  ): Promise<IBook[]> {
    const bookCategory = await this.prisma.book_category.findMany({
      where: {
        id: categoryId,
      },
      take: maxResult ? maxResult : 30,
      skip: startIndex,
    });

    if (Array.isArray(bookCategory) && bookCategory.length === 0) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Category not found",
      });
    }

    const books = new Array(bookCategory.length);

    for (let i = 0; i < bookCategory.length; i++) {
      books.push(
        await this.prisma.books.findUnique({
          where: { id: bookCategory[i].bookId },
        })
      );
    }

    const newBookWithCategoryAndAuthor: IBook[] =
      await this.getBookWithCategoryAndAuthor(books);

    return newBookWithCategoryAndAuthor;
  }

  private async getBookBySerias(
    seriasId: number,
    maxResult?: number,
    startIndex?: number
  ): Promise<IBook[]> {
    const books: IBook[] = await this.prisma.books.findMany({
      where: {
        seriasId: seriasId,
      },
      take: maxResult ? maxResult : 30,
      skip: startIndex,
    });

    const newBookWithCategoryAndAuthor: IBook[] =
      await this.getBookWithCategoryAndAuthor(books);

    return newBookWithCategoryAndAuthor;
  }

  private async getBookByPublisher(
    publisherId: number,
    maxResult?: number,
    startIndex?: number
  ): Promise<IBook[]> {
    const books = await this.prisma.books.findMany({
      where: {
        publisherId: publisherId,
      },
      take: maxResult ? maxResult : 30,
      skip: startIndex,
    });

    const newBookWithCategoryAndAuthor: IBook[] =
      await this.getBookWithCategoryAndAuthor(books);

    return newBookWithCategoryAndAuthor;
  }

  public async getBookBySearch(payload: IPayload): Promise<IBook[]> {
    if (payload.maxResult && payload.maxResult > 60) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Max result not to exceed 60",
      });
    }

    if (payload && payload.book && payload.book.length <= 1) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Small search bar",
      });
    }

    if (payload.serias) {
      return this.getBookBySerias(
        payload.serias,
        payload.maxResult,
        payload.startIndex
      );
    }

    if (payload.category) {
      return this.getBookByCategory(
        payload.category,
        payload.maxResult,
        payload.startIndex
      );
    }

    if (payload.publisher) {
      return this.getBookByPublisher(
        payload.publisher,
        payload.maxResult,
        payload.startIndex
      );
    }

    const books: IBook[] = await this.prisma.books.findMany({
      where: {
        name: {
          contains: payload.book
        },
      },
      take: payload.maxResult ? payload.maxResult : 30,
      skip: payload.startIndex,
    });

    const newBookWithCategoryAndAuthor: IBook[] =
      await this.getBookWithCategoryAndAuthor(books);

    return newBookWithCategoryAndAuthor;
  }
}

interface IPayload {
  book?: string;
  serias?: number;
  category?: number;
  publisher?: number;
  maxResult?: number;
  startIndex?: number;
}
