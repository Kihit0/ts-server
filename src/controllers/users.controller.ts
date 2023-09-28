import express, { Request, Response, Router } from "express";

export class UsersController {
  private router: Router;
  constructor() {
    this.router = express.Router();
    this.router.get("/", this.getUsers);
  }

  public getRouter = () => {
    return this.router;
  };

  private getUsers = async (_req: Request, _res: Response) => {
    try {
      const users = [{ name: "Kira" }, { name: "Hean" }];
      _res.send(users);
    } catch (error: unknown) {
      const err = error as Error;
    }
  };
}
