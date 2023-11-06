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
import { IUser } from "@interfaces/root.interface";
import { HttpCodes } from "@enums/HttpStatusCode";

@JsonController("/users")
export class UserController {
  private userService;

  constructor() {
    this.userService = new UserService();
  }

  @Authorized(["admin"])
  @Get("")
  @HttpCode(HttpCodes.OK)
  async getUser(): Promise<IOutput> {
    const users: IUser[] = await this.userService.getAllUsers();
    return {
      code: HttpCodes.OK,
      data: users,
    };
  }

  @Get("/:id")
  @HttpCode(HttpCodes.OK)
  async getOneUser(@Param("id") id: number): Promise<IOutput> {
    const user: IUser = await this.userService.getOneUser(id);
    return {
      code: HttpCodes.OK,
      data: user,
    };
  }

  @Authorized()
  @Put("/:id")
  @HttpCode(HttpCodes.OK)
  async updateUser(
    @Param("id") id: number,
    @Body() user: IUser
  ): Promise<IOutput> {
    const updateUser: IUser = await this.userService.updateUser(id, user);
    return {
      code: HttpCodes.OK,
      data: updateUser,
    };
  }

  @Authorized()
  @Delete("/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  async deleteUser(@Param("id") id: number): Promise<IOutput> {
    const deleteUser: IUser = await this.userService.deleteUser(id);
    return {
      code: HttpCodes.OK,
      data: deleteUser,
    };
  }
}

interface IOutput {
  code: HttpCodes;
  data: IUser | IUser[];
}
