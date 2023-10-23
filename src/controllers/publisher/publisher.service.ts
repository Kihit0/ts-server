import prisma from "@db/prisma";
import { HttpCodes } from "@enums/HttpStatusCode";
import { AppError } from "@exceptions/AppError";
import { IPublisher } from "@interfaces/root.interface";
import { PrismaClient } from "@prisma/client";

export class PublisherService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  public async getAllPublsiher(): Promise<IPublisher[]> {
    const publishers: IPublisher[] = await this.prisma.publisher.findMany();

    return publishers;
  }

  public async getPublisher(id: number): Promise<IPublisher> {
    const publisher: IPublisher | null = await this.prisma.publisher.findUnique(
      {
        where: {
          id,
        },
      }
    );

    if (!publisher) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Publisher not found",
      });
    }
    return publisher;
  }

  public async createPublisher(body: IPublisher): Promise<IPublisher> {
    const oldPublisher: IPublisher | null =
      await this.prisma.publisher.findFirst({
        where: {
          name: body.name,
        },
      });

    if (oldPublisher) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "This publsher already exist",
      });
    }

    const newPublisher: IPublisher = await this.prisma.publisher.create({
      data: body,
    });

    return newPublisher;
  }

  public async updatePublisher(
    body: IPublisher,
    id: number
  ): Promise<IPublisher> {
    const isOldPublisher: IPublisher = await this.getPublisher(id);

    return (
      isOldPublisher &&
      (await this.prisma.publisher.update({
        where: {
          id,
        },
        data: body,
      }))
    );
  }

  public async deletePublisher(id: number): Promise<IPublisher> {
    const isOldPublisher: IPublisher = await this.getPublisher(id);

    return (
      isOldPublisher &&
      (await this.prisma.publisher.delete({
        where: {
          id,
        },
      }))
    );
  }
}
