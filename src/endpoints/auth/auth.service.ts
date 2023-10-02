import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import jwt, { Secret } from "jsonwebtoken";
import prisma from "@db/prisma";
import { AppError } from "@exceptions/AppError";
import { HttpCode } from "@enums/HttpStatusCode";
import { IUser } from "@endpoints/user/user.interface";

dotenv.config();

export class AuthService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  public async getUser(user: any) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: user.email,
      },
    });

    if (!findUser) {
      throw new AppError({
        httpCode: HttpCode.BAD_GATEWAY,
        description: "User not found",
      });
    }

    return findUser;
  }

  public async getTokens(userId: number) {
    const token = await this.prisma.token.findUnique({
      where: { id: userId },
    });

    if (!token) {
      throw new AppError({
        httpCode: HttpCode.BAD_GATEWAY,
        description: "User not found",
      });
    }

    return token;
  }

  public async login(user: any) {
    if (!user.token) {
      throw new AppError({
        httpCode: HttpCode.BAD_GATEWAY,
        description: "Token not found",
      });
    }

    const findUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!findUser) {
      throw new AppError({
        httpCode: HttpCode.BAD_GATEWAY,
        description: "User not found",
      });
    }

    const token = await this.prisma.token.findFirst({
      where: {
        userId: findUser.id,
      },
    });
    
  }

  public async createUser(user: IUser) {
    if (!(user.email && user.password && user.username && user.family)) {
      throw new AppError({
        httpCode: HttpCode.BAD_GATEWAY,
        description: "All input is requred",
      });
    }

    const isOldUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (isOldUser) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: "User already exit. Pleas login",
      });
    }

    const password: string = CryptoJS.AES.encrypt(
      user.password,
      user.email
    ).toString();
    const token: string = jwt.sign(
      { email: user.email },
      process.env.TOKEN_SECRET as Secret,
      {
        expiresIn: "30d",
      }
    );

    Object.assign(user, { password, createDate: new Date() });

    const newUser = await this.prisma.user.create({
      data: user,
    });

    await this.prisma.token.create({
      data: {
        userId: newUser.id,
        token,
        expiration: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    });

    return newUser;
  }
}
