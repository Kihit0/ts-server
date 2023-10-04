import "module-alias/register";
import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import prisma from "./db/prisma";
import { UserController } from "@endpoints/user/user.controller";
import { AuthController } from "@endpoints/auth/auth.controller";

dotenv.config();

const PORT = process.env.PORT || 3000;

class App {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  public __init__ = () => {
    createExpressServer({
      routePrefix: "/api",
      controllers: [UserController, AuthController],
    }).listen(PORT);

    process.on("beforeExit", async () => {
      await this.prisma.$disconnect();
    });
  };
}

export const app = new App();
app.__init__();
