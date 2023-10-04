import { PrismaClient } from "@prisma/client";
import CryptoJS from "crypto-js";
import jwt, { Secret } from "jsonwebtoken";
import prisma from "@db/prisma";
import { AppError } from "@exceptions/AppError";
import { HttpCode } from "@enums/HttpStatusCode";
import { IUser } from "@interfaces/user.interface";

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
        httpCode: HttpCode.BAD_REQUEST,
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
        httpCode: HttpCode.BAD_REQUEST,
        description: "Token not valid",
      });
    }

    return token;
  }

  private isValidToken(fToken: string[], bToken: string[]): void {
    if (fToken.length !== bToken.length) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: "Token not valid",
      });
    }

    for (let i = 0; i < 3; i++) {
      if (fToken[i] !== bToken[i]) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: "Token not valid",
        });
      }
    }
  }

  private isValidPassword(fPassword: string, bUser: IUser): void {
    const decryptBackPassword = CryptoJS.AES.decrypt(
      bUser.password ? bUser.password : "",
      bUser.email
    ).toString(CryptoJS.enc.Utf8);

    if (fPassword !== decryptBackPassword) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: "Password not valid",
      });
    }
  }

  public async login(user: IUser): Promise<IUser> {
    if (!user.token) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: "Token not found",
      });
    }

    const findUser = await this.getUser(user);
    const token = await this.getToken(findUser.id);

    this.isValidToken(user.token.split("."), token.token.split("."));
    this.isValidPassword(user.password ? user.password : "", findUser);

    const { password, ...loginUser } = findUser;

    return Object.assign(loginUser, { token: token.token });
  }

  public async createUser(user: IUser): Promise<IUser> {
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

  public async remove(id: number): Promise<IUser> {
    const user = this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: "User not found",
      });
    }

    const deleteUser = await this.prisma.user.delete({
      where: { id },
    });

    const {password, ...dUser} = deleteUser;

    return dUser;
  }
}
