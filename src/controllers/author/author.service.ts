import prisma from "@db/prisma";
import { HttpCodes } from "@enums/HttpStatusCode";
import { AppError } from "@exceptions/AppError";
import { IAuthor } from "@interfaces/root.interface";
import { PrismaClient } from "@prisma/client";

export class AuthorService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  private showError(httpCode: HttpCodes, description: string) {
    throw new AppError({
      httpCode,
      description,
    });
  }

  public async getAllAuthor(
    startIndex: number | undefined,
    maxResult: number | undefined
  ): Promise<IAuthor[]> {
    if (maxResult !== undefined && maxResult > 60)
      this.showError(HttpCodes.BAD_REQUEST, "Max result not to exceed 60");

    const allAuhtor: IAuthor[] | null = await this.prisma.author.findMany({
      skip: startIndex !== undefined ? startIndex : 0,
      take: maxResult !== undefined ? maxResult : 30,
    });

    if (!allAuhtor) this.showError(HttpCodes.BAD_REQUEST, "Author not found");

    return allAuhtor;
  }

  public async getAuthor(id: number): Promise<IAuthor> {
    const author: IAuthor | null = await this.prisma.author.findUnique({
      where: {
        id,
      },
    });

    if (!author) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Author not found",
      });
    }

    return author;
  }

  public async createAuthor(body: IAuthor): Promise<IAuthor> {
    if (!body.fname && !body.sname)
      this.showError(HttpCodes.BAD_REQUEST, "Data not filled in");

    const newAuthor: IAuthor | null = await this.prisma.author.create({
      data: body,
    });

    if (!newAuthor) this.showError(HttpCodes.BAD_REQUEST, "Author not created");

    return newAuthor;
  }

  public async updateAuthor(id: number, body: IAuthor): Promise<IAuthor> {
    const author: IAuthor | null = await this.prisma.author.findUnique({
      where: {
        id,
      },
    });

    if (!author) this.showError(HttpCodes.BAD_REQUEST, "Author not found");

    const updateAuthor = await this.prisma.author.update({
      where: {
        id,
      },
      data: body,
    });

    return updateAuthor;
  }

  public async deleteAuthor(id: number): Promise<IAuthor> {
    const author: IAuthor | null = await this.prisma.author.findUnique({
      where: {
        id,
      },
    });

    if (!author) this.showError(HttpCodes.BAD_REQUEST, "Author not found");

    const deleteAuthor: IAuthor = await this.prisma.author.delete({
      where: {
        id,
      },
    });

    return deleteAuthor;
  }
}
