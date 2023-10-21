import { PrismaClient } from "@prisma/client";
import prisma from "@db/prisma";
import { IUser } from "@interfaces/user.interface";
import { AppError } from "@exceptions/AppError";
import { HttpCodes } from "@enums/HttpStatusCode";
import { IBook } from "@interfaces/books.interface";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  private async getBookById(
    bookId: number[],
    books: IBook[] | any[]
  ): Promise<IBook[]> {
    if (bookId.length === 0) return books;

    const book: IBook | null = await this.prisma.books.findUnique({
      where: {
        id: bookId[bookId.length - 1],
      },
    });

    if (book) {
      books.push(book);
    }

    return await this.getBookById(bookId.splice(0, bookId.length - 2), books);
  }

  private async getFavoriteBooks(id: number): Promise<IBook[]> {
    const favorite = await this.prisma.favorite.findMany({
      where: {
        userId: id,
      },
    });

    const booksId: number[] = favorite.map((el) => el.bookId);
    const books: IBook[] = new Array(booksId.length);
    const favoriteBook: IBook[] = await this.getBookById(booksId, books);

    return favoriteBook;
  }

  public getAllUsers = async (): Promise<IUser[]> => {
    const users = await this.prisma.user.findMany();

    if (!users) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Error. Users not found",
      });
    }

    const usersWithBook = users.map((item) => {
      const { password, ...user } = item;
      return user;
    });

    for (let i = 0; i < usersWithBook.length; i++) {
      const books = await this.getFavoriteBooks(usersWithBook[i].id);
      Object.assign(usersWithBook[i], { favorite: books });
    }

    return usersWithBook;
  };

  public getOneUser = async (id: number): Promise<IUser> => {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "User not found",
      });
    }

    const { password, ...fUser } = user;

    const books = await this.getFavoriteBooks(fUser.id);

    Object.assign(fUser, { favorite: books });

    return fUser;
  };

  public updateUser = async (id: number, body: any) => {
    const user = await this.getOneUser(id);

    if (!user) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Failed to update user",
      });
    }

    const updateUser = await this.prisma.user.update({
      where: { id: id },
      data: body,
    });

    const { password, ...fUser } = updateUser;

    return fUser;
  };

  public deleteUser = async (id: number) => {
    const user = await this.getOneUser(id);

    if (!user) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Failed to update user",
      });
    }

    const deleteUser = await this.prisma.user.delete({
      where: { id: id },
    });

    return deleteUser;
  };
}
