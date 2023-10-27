import { PrismaClient } from "@prisma/client";
import {
  IAuthor,
  IBook,
  ICategory,
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

  private async getCategory(bookId: number): Promise<string[]> {
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
    for (let i = 0; i <= categoryArray.length; i++) {
      const category: ICategory | null = await this.prisma.category.findUnique({
        where: {
          id: categoryArray[i].categoryId,
        },
      });
      category && frontCategory.push(category);
    }

    return frontCategory.map((cat) => cat.name);
  }

  private async getBookWithCategoryAndAuthor(
    book: IBook[] | IBook
  ): Promise<any> {
    if (Array.isArray(book)) {
      for (let i = 0; i <= book.length; i++) {
        const author: object[] = await this.getAuthor(book[i].id);
        const category: string[] = await this.getCategory(book[i].id);

        Object.assign(book[i], { category, author });
      }
      return book;
    } else {
      const author: object[] = await this.getAuthor(book.id);
      const category: string[] = await this.getCategory(book.id);

      Object.assign(book, { category, author });
      return book;
    }
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

  public async getBookByCategory(
    categoryId: number,
    maxResult?: number,
    startIndex?: number
  ): Promise<IBook[]> {
    if (maxResult && maxResult > 60) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Max result not to exceed 60",
      });
    }

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

    return books;
  }

  public async getBookBySerias(
    seriasId: number,
    maxResult?: number,
    startIndex?: number
  ): Promise<IBook[]> {
    if (maxResult && maxResult > 60) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Max result not to exceed 60",
      });
    }

    const books: IBook[] = await this.prisma.books.findMany({
      where: {
        seriasId: seriasId,
      },
      take: maxResult ? maxResult : 30,
      skip: startIndex,
    });

    return books;
  }

  public async getBookByPublisher(
    publisherId: number,
    maxResult?: number,
    startIndex?: number
  ): Promise<IBook[]> {
    if (maxResult && maxResult > 60) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Max result not to exceed 60",
      });
    }

    const books = await this.prisma.books.findMany({
      where: {
        publisherId: publisherId,
      },
      take: maxResult ? maxResult : 30,
      skip: startIndex,
    });

    return books;
  }

  public async getBookBySearch(
    name?: string,
    author?: string
  ): Promise<IBook[]> {
    const books = new Array();
    const authors: IAuthor[] | undefined | null | "" =
      author &&
      (await this.prisma.author.findMany({
        where: {
          fname: author,
        },
      }));

    const bookSearchByName = await this.prisma.books.findMany({
      where: {
        name: name,
      },
    });

    if (!authors && bookSearchByName.length === 0) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Books not found",
      });
    }

    if (Array.isArray(authors)) {
      const booksAuthor = new Array();
      for (let i = 0; i < authors.length; i++) {
        booksAuthor.push(
          await this.prisma.book_author.findMany({
            where: {
              authorId: authors[i].id,
            },
          })
        );
      }

      const book = new Array(booksAuthor.length);
      
    }
  }
}
