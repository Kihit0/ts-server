import { JsonController, Get, HttpCode } from "routing-controllers";
import { RoleService } from "./role.service";
import { IRole } from "@interfaces/root.interface";
import { HttpCodes } from "@enums/HttpStatusCode";

@JsonController("/role")
export class RoleController {
  private RoleService;
  constructor() {
    this.RoleService = new RoleService();
  }

  @Get("/all")
  @HttpCode(HttpCodes.OK)
  public async getRole() : Promise<IOutpput> {
    const date: IRole[] = await this.RoleService.getAllRoles();
    return {
      code: HttpCodes.OK,
      date
    }
  }
}


interface IOutpput{
  code: HttpCodes,
  date: IRole | IRole[]
}