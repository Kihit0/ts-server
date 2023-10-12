import {
  JsonController,
  Param,
  Body,
  Get,
  Put,
  Delete,
  HttpCode,
} from "routing-controllers";
import { UserService } from "./user.service";
import { IUser } from "@interfaces/user.interface";
import { HttpCodes } from "@enums/HttpStatusCode";

@JsonController("/users")
export class UserController {
  private userServise;

  constructor() {
    this.userServise = new UserService();
  }

  @Get("/all")
  @HttpCode(200)
  async getUser(): Promise<IUotput> {
    const users = await this.userServise.getAllUsers();
    return {
      code: HttpCodes.OK,
      date: users,
    };
  }

  @Get("/:id")
  @HttpCode(200)
  async getOneUser(@Param("id") id: number): Promise<IUotput> {
    const user = await this.userServise.getOneUser(id);
    return {
      code: HttpCodes.OK,
      date: user,
    };
  }

  @Put("/update/:id")
  @HttpCode(200)
  async updateUser(
    @Param("id") id: number,
    @Body() user: any
  ): Promise<IUotput> {
    const updateUser = await this.userServise.updateUser(id, user);
    return {
      code: HttpCodes.OK,
      date: updateUser,
    };
  }

  @Delete("/remove/:id")
  @HttpCode(204)
  async deleteUser(@Param("id") id: number): Promise<IUotput> {
    const deleteUser = await this.userServise.deleteUser(id);
    return {
      code: HttpCodes.OK,
      date: deleteUser,
    };
  }
}

interface IUotput {
  code: HttpCodes;
  date: IUser | IUser[];
}
