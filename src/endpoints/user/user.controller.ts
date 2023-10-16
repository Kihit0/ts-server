import {
  JsonController,
  Param,
  Body,
  Get,
  Put,
  Delete,
  HttpCode,
  Authorized,
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
  @HttpCode(HttpCodes.OK)
  async getUser(): Promise<IUotput> {
    const users: IUser[] = await this.userServise.getAllUsers();
    return {
      code: HttpCodes.OK,
      date: users,
    };
  }

  @Get("/:id")
  @HttpCode(HttpCodes.OK)
  async getOneUser(@Param("id") id: number): Promise<IUotput> {
    const user: IUser = await this.userServise.getOneUser(id);
    return {
      code: HttpCodes.OK,
      date: user,
    };
  }

  @Authorized()
  @Put("/update/:id")
  @HttpCode(HttpCodes.OK)
  async updateUser(
    @Param("id") id: number,
    @Body() user: IUser
  ): Promise<IUotput> {
    const updateUser: IUser = await this.userServise.updateUser(id, user);
    return {
      code: HttpCodes.OK,
      date: updateUser,
    };
  }

  @Authorized()
  @Delete("/remove/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  async deleteUser(@Param("id") id: number): Promise<IUotput> {
    const deleteUser: IUser = await this.userServise.deleteUser(id);
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
