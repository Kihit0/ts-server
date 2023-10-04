import { JsonController, Post, Body, Delete, Param  } from "routing-controllers";
import { AuthService } from "./auth.service";
import { IUser } from "@interfaces/user.interface";

@JsonController("/auth")
export class AuthController {
  private AuthService;
  constructor() {
    this.AuthService = new AuthService();
  }

  @Post("/login")
  async loggin(@Body() user: IUser): Promise<IUser> {
    const login:IUser = await this.AuthService.login(user);
    return login;
  }

  @Post("/register")
  async register(@Body() user: IUser): Promise<IUser> {
    const createUser: IUser = await this.AuthService.createUser(user);
    return createUser;
  }

  @Delete("/remove/:id")
  async remove(@Param("id") id: number): Promise<IUser> {
    const removeUser: IUser = await this.AuthService.remove(id);
    return removeUser;
  }
}
