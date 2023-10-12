import { PrismaClient } from "@prisma/client";
import prisma from "@db/prisma";
import { IUser } from "@interfaces/user.interface";
import { AppError } from "@exceptions/AppError";
import { HttpCodes } from "@enums/HttpStatusCode";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  public getAllUsers = async () => {
    const users = await this.prisma.user.findMany();

    if (!users) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Error. Users not found",
      });
    }

    return users;
  };

  public getOneUser = async (id: number) => {
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

    return user;
  };

  public createUser = async (body: IUser) => {
    const createUser = await this.prisma.user.create({
      data: {
        createDate: new Date(),
        password: body.password || "",
        ...body
      },
    });

    if (!createUser) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Failed to create user",
      });
    }

    return createUser;
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

    return updateUser;
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
