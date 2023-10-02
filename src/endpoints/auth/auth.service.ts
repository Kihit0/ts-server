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

  private async getUser(user: any) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
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

  private async getToken(userId: number) {
    const token = await this.prisma.token.findUnique({
      where: { userId: userId },
    });

    if (!token) {
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: "Token not valid",
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

    const findUser = await this.getUser(user);
    const token = await this.getToken(findUser.id)
    const tokenBack = token.token.split(".");
    const tokenFront = user.token.split(".");

    if (tokenBack.length !== tokenFront.length) {
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: "Token not valid",
      });
    } else {
      for (let i = 0; i < 3; i++) {
        if (tokenBack[i] !== tokenFront[i]) {
          throw new AppError({
            httpCode: HttpCode.UNAUTHORIZED,
            description: "Token not valid",
          });
        }
      }
    }

    return Object.assign(findUser,{token: token.token});
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
