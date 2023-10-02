import { JsonController, Get, Post, Body, Delete  } from "routing-controllers";
import { AuthService } from "./auth.service";
import { IUser } from "@endpoints/user/user.interface";

@JsonController("/auth")
export class AuthController {
  private AuthService;
  constructor() {
    this.AuthService = new AuthService();
  }

  @Post("/login")
  async loggin(@Body() user: any) {
    const userDetails = await this.AuthService.getUser(user);
    const tokenDetails = await this.AuthService.getTokens(userDetails.id);
  }

  @Post("/register")
  async register(@Body() user: IUser) {
    const createUser = await this.AuthService.createUser(user);
    return createUser;
  }

  @Get("/logout")
  async logout() {}

  @Delete("/remove")
  async remove() {}
}
