import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { UsersController } from "./controllers/users.controller";

dotenv.config();

const PORT = process.env.PORT || 3000;

class App {
  private app: Express;
  constructor() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(cors());
  }

  public __init__ = async () => {
    try {
      this.app.listen(PORT, () => {
        console.log("Server started");
      });

      this.app.use("/users", new UsersController().getRouter());
    } catch (error: unknown) {
        const err = error as Error;
        console.log(err.message);
    }
  };
}

export const app = new App();

app.__init__().then(() => {
    console.log("server is ok");
}).catch(() => {
    console.log("server is problem");
});