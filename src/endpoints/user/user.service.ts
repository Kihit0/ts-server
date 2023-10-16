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

  public getAllUsers = async (): Promise<IUser[]> => {
    const users = await this.prisma.user.findMany();

    if (!users) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Error. Users not found",
      });
    }

    return users.map((item) => {
      const { password, ...user } = item;
      return user;
    });
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

    const {password, ...fUser} = user;

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

    const {password, ...fUser} = updateUser;

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
