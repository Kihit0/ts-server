import { JsonController, Post, Body, HttpCode } from "routing-controllers";
import { AuthService } from "./auth.service";
import { IUser } from "@interfaces/root.interface";
import { HttpCodes } from "@enums/HttpStatusCode";

@JsonController("/auth")
export class AuthController {
  private AuthService;
  constructor() {
    this.AuthService = new AuthService();
  }

  @Post("/login")
  @HttpCode(HttpCodes.OK)
  async loggin(@Body() user: IUser): Promise<IUotput> {
    const login:IUser = await this.AuthService.login(user);
    return {
      code: HttpCodes.OK,
      date: login
    };
  }

  @Post("/register")
  @HttpCode(HttpCodes.CREATED)
  async register(@Body() user: IUser): Promise<IUotput> {
    const createUser: IUser = await this.AuthService.createUser(user);
    return {
      code: HttpCodes.CREATED,
      date: createUser
    };
  }

}

interface IUotput{
  code: HttpCodes,
  date: IUser
}