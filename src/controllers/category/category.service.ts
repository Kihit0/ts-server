import prisma from "@db/prisma";
import { HttpCodes } from "@enums/HttpStatusCode";
import { AppError } from "@exceptions/AppError";
import { ICategory } from "@interfaces/root.interface";
import { PrismaClient } from "@prisma/client";

export class CategoryService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  private async getGategory(id: number): Promise<ICategory> {
    const category: ICategory | null = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Vategory not found",
      });
    }

    return category;
  }

  public async getAllCategory(): Promise<ICategory[]> {
    const categoryies = await this.prisma.category.findMany();

    return categoryies;
  }

  public async createCategory(body: ICategory): Promise<ICategory> {
    const isOldCategory: ICategory | null =
      await this.prisma.category.findFirst({
        where: {
          name: body.name,
        },
      });

    if (isOldCategory) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "This category is already in place",
      });
    }

    const newCategory = await this.prisma.category.create({
      data: body,
    });

    return newCategory;
  }

  public async updateCategory(id: number, body: ICategory): Promise<ICategory> {
    const isOldCategory = await this.getGategory(id);

    return (
      isOldCategory &&
      (await this.prisma.category.update({
        where: {
          id: body.id,
        },
        data: body,
      }))
    );
  }

  public async deleteCaregory(id: number): Promise<ICategory> {
    const isOldCategory = await this.getGategory(id);

    return (
      isOldCategory &&
      (await this.prisma.category.delete({
        where: {
          id,
        },
      }))
    );
  }
}
