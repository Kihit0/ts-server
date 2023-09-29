import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

export class UsersController {
  /* Variabels */
  private router: Router;
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.router = express.Router();
    this.router.get("/", this.getUsers);
    this.router.post("/", this.addUser);
    this.router.get("/:id", this.getUser);
    this.router.put("/:id", this.updateUser);
    this.router.delete("/:id", this.deleteUser);
    this.db = db;
  }

  public getRouter = () => {
    return this.router;
  };

  /* Endpoints */
  private getUsers = async (_req: Request, _res: Response) => {
    try {
      const users = await this.db.user.findMany();
      _res.json(users);
    } catch (error: unknown) {
      const err = error as Error;
      console.log(err.message);
    }
  };

  private getUser = async (_req: Request, _res: Response) => {
    try {
      const user = await this.db.user.findUnique({
        where: { id: _req.params.id },
      });
      return user ? _res.json(user) : "User not found";
    } catch (error: unknown) {
      const err = error as Error;
      return _res.send(err.message);
    }
  };

  private addUser = async (_req: Request, _res: Response) => {
    try {
      const newUser = await this.db.user.create({
        data: _req.body,
      });

      return _res.json(newUser);
    } catch (error: unknown) {
      const err = {
        message: "Error create user",
      };
      return _res.send(err.message);
    }
  };

  private updateUser = async (_req: Request, _res: Response) =>{
    try{
      const user = await this.db.user.update({
        where: {id: _req.params.id},
        data: _req.body
      })

      return _res.json(user);
    } catch(error: unknown) {
      const err = error as Error;
      
      return _res.send(err.message);
    }
  };

  private deleteUser = async (_req: Request, _res: Response) =>{
    try{
      const user = await this.db.user.delete({
        where: {id: _req.params.id}
      })
      
      return _res.json(user);
    } catch(error: unknown){
      const err = {
        status: 404,
        message: "Not found"
      }

      return _res.send(err);
    }
  };
}
