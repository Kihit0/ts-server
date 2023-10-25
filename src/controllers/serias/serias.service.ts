import prisma from "@db/prisma";
import { HttpCodes } from "@enums/HttpStatusCode";
import { AppError } from "@exceptions/AppError";
import { ISerias } from "@interfaces/root.interface";
import { PrismaClient } from "@prisma/client";

export class SeriasService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  public async getAllSerias(): Promise<ISerias[]> {
    const allSerias: ISerias[] = await this.prisma.serias.findMany();
    return allSerias;
  }

  public async getSerias(id: number): Promise<ISerias> {
    const serias: ISerias | null = await this.prisma.serias.findUnique({
      where: {
        id,
      },
    });

    if (!serias) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Serias not found",
      });
    }

    return serias;
  }

  public async createSerias(body: ISerias): Promise<ISerias> {
    const isOldSerias: ISerias | null = await this.prisma.serias.findUnique({
      where: {
        name: body.name,
      },
    });

    if (isOldSerias) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "This serias already exist",
      });
    }

    const newSerias: ISerias = await this.prisma.serias.create({
      data: body,
    });

    return newSerias;
  }

  public async updateSerias(id: number, body: ISerias): Promise<ISerias> {
    const isOldSerias: ISerias | null = await this.prisma.serias.findUnique({
      where: {
        id,
      },
    });

    if (!isOldSerias) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Serias not found",
      });
    }

    const updateSerias: ISerias = await this.prisma.serias.update({
      where: {
        id,
      },
      data: body,
    });

    return updateSerias;
  }

  public async deleteSerias(id: number): Promise<ISerias> {
    const isOldSerias: ISerias | null = await this.prisma.serias.findUnique({
      where: {
        id,
      },
    });

    if (!isOldSerias) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Serias not found",
      });
    }

    const deleteSerias: ISerias = await this.prisma.serias.delete({
      where: {
        id,
      },
    });

    return deleteSerias;
  }
}
