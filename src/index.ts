import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import { UsersController } from "./controllers/users.controller";
import prisma from "./db/prisma";

dotenv.config();

const PORT = process.env.PORT || 3000;

class App {
  private app: Express;
  private prisma: PrismaClient;

  constructor() {
    /* App express */
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(cors());

    /* DB */
    this.prisma = prisma;
  }

  public __init__ = async () => {
    try {


      this.app.listen(PORT, () => {
        console.log("Server started");
      });

      /* Endpoints */
      this.app.use("/api/users", new UsersController(this.prisma).getRouter());


      process.on("beforeExit", async () =>{
        await this.prisma.$disconnect();
      });
    } catch (error: unknown) {
        const err = error as Error;
        console.log(err.message);
    }
  }
}
console.clear();
export const app = new App();

app.__init__().then(() => {
    console.log("server is ok");
}).catch(() => {
    console.log("server is problem");
});