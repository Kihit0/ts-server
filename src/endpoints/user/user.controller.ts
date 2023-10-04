import {
  JsonController,
  Param,
  Body,
  Get,
  Put,
  Delete,
} from "routing-controllers";
import { UserService } from "./user.service";
import { IUser } from "@interfaces/user.interface";

@JsonController("/users")
export class UserController {
  private userServise;

  constructor() {
    this.userServise = new UserService();
  }

  @Get("/")
  async getUser(): Promise<IUser[]> {
    const users = await this.userServise.getAllUsers();
    return users;
  }

  @Get("/:id")
  async getOneUser(@Param("id") id: number): Promise<IUser> {
    const user = await this.userServise.getOneUser(id);
    return user;
  }

  @Put("/:id")
  async updateUser(@Param("id") id: number, @Body() user: any): Promise<IUser> {
    const updateUser = await this.userServise.updateUser(id, user);
    return updateUser;
  }

  @Delete("/:id")
  async deleteUser(@Param("id") id: number): Promise<IUser> {
    const deleteUser = await this.userServise.deleteUser(id);
    return deleteUser;
  }
}
