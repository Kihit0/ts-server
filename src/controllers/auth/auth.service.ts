import { PrismaClient } from "@prisma/client";
import CryptoJS from "crypto-js";
import jwt, { Secret } from "jsonwebtoken";
import prisma from "@db/prisma";
import { AppError } from "@exceptions/AppError";
import { HttpCodes } from "@enums/HttpStatusCode";
import { IUser } from "@interfaces/root.interface";

export class AuthService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  private async getUser(user: IUser) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!findUser) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
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
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Token not valid",
      });
    }

    return token;
  }

  private isValidPassword(fPassword: string, bUser: IUser): void {
    const decryptBackPassword = CryptoJS.AES.decrypt(
      bUser.password ? bUser.password : "",
      bUser.email
    ).toString(CryptoJS.enc.Utf8);

    if (fPassword !== decryptBackPassword) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Password not valid",
      });
    }
  }

  public async login(user: IUser): Promise<IUser> {

    const findUser = await this.getUser(user);
    const token = await this.getToken(findUser.id);

    this.isValidPassword(user.password ? user.password : "", findUser);

    if (new Date(token.expiration) <= new Date()) {
      await this.prisma.token.update({
        where: {
          userId: findUser.id,
        },
        data: {
          updateAt: new Date(),
          expiration: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
      });
    }

    const { password, ...loginUser } = findUser;

    return Object.assign(loginUser, { token: token.token });
  }

  public async createUser(user: IUser): Promise<IUser> {
    if (!(user.email && user.password && user.username && user.family)) {
      throw new AppError({
        httpCode: HttpCodes.BAD_GATEWAY,
        description: "All input is requred",
      });
    }

    const isOldUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (isOldUser) {
      throw new AppError({
        httpCode: HttpCodes.CONFLICT,
        description: "User already exit. Pleas login",
      });
    }

    const role = await this.prisma.role.findUnique({
      where: {
        id: user.roleId,
      },
    });

    if (user.roleId !== role?.id) {
      throw new AppError({
        httpCode: HttpCodes.CONFLICT,
        description: "There is no such role",
      });
    }

    const passwordEncryot: string = CryptoJS.AES.encrypt(
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

    Object.assign(user, { password: passwordEncryot });

    const newUser: IUser = await this.prisma.user.create({
      data: {
        createDate: new Date(),
        password: user.password && user.password,
        ...user,
      },
    });

    await this.prisma.token.create({
      data: {
        userId: newUser.id,
        token,
        expiration: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    });

    const { password, ...userFront } = newUser;

    return Object.assign(userFront, { token });
  }
}
