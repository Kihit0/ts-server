import "module-alias/register";
import "reflect-metadata";
import { Action, createExpressServer } from "routing-controllers";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import prisma from "./db/prisma";
import { UserController } from "@endpoints/user/user.controller";
import { AuthController } from "@endpoints/auth/auth.controller";
import { RoleController } from "@endpoints/role/role.controller";
import { IToken } from "@interfaces/token.interface";
import { IUser } from "@interfaces/user.interface";
import { IRole } from "@interfaces/role.interface";
import { CategoryController } from "@endpoints/category/category.controller";
import { AppError } from "@exceptions/AppError";
import { HttpCodes } from "@enums/HttpStatusCode";

dotenv.config();

const PORT = process.env.PORT || 3000;

class App {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  private async getUserByToken(token: string): Promise<IUser | null> {
    const bToken: IToken | null = await this.prisma.token.findFirst({
      where: {
        token: token,
      },
    });

    if (!bToken) {
      return null;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: bToken.userId,
      },
    });

    return user;
  }

  private async getRoles(): Promise<IRole[]> {
    return await this.prisma.role.findMany();
  }

  public __init__ = () => {
    createExpressServer({
      authorizationChecker: async (action: Action, roles: string[]) => {
        const token = action.request.headers["authorization"];

        if (!token) {
          throw new AppError({
            httpCode: HttpCodes.UNAUTHORIZED,
            description: "User not authorized",
          });
        }

        const user: IUser | null = await this.getUserByToken(token);
        const allRoles = await this.getRoles();

        if (!user) {
          throw new AppError({
            httpCode: HttpCodes.BAD_REQUEST,
            description: "User not found",
          });
        }

        if (user && !roles.length) return true;
        if (
          user &&
          roles.find((role) =>
            allRoles.find(
              (roles) => user.roleId === roles.id && role === roles.name
            )
          )
        )
          return true;

        throw new AppError({
          httpCode: HttpCodes.FORBIDDEN,
          description: "Access denied",
        });
      },
      routePrefix: "/api",
      controllers: [
        UserController,
        AuthController,
        RoleController,
        CategoryController,
      ],
    }).listen(PORT);

    process.on("beforeExit", async () => {
      await this.prisma.$disconnect();
    });
  };
}

export const app = new App();
app.__init__();
