import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  Authorized,
} from "routing-controllers";
import { HttpCodes } from "@enums/HttpStatusCode";
import { ISerias } from "@interfaces/root.interface";
import { SeriasService } from "./serias.service";

@JsonController("/serias")
export class SeriasController {
  private readonly SeriasService;

  constructor() {
    this.SeriasService = new SeriasService();
  }

  @Get("")
  @HttpCode(HttpCodes.OK)
  public async getAllSerias(): Promise<IOutput> {
    const allSerias: ISerias[] = await this.SeriasService.getAllSerias();

    return {
      code: HttpCodes.OK,
      data: allSerias,
    };
  }

  @Get("/:id")
  @HttpCode(HttpCodes.OK)
  public async getSerias(@Param("id") id: number): Promise<IOutput> {
    const serias: ISerias = await this.SeriasService.getSerias(id);
    return {
      code: HttpCodes.OK,
      data: serias,
    };
  }

  @Authorized(["admin", "manager"])
  @Post("")
  @HttpCode(HttpCodes.OK)
  public async createSerisas(@Body() body: ISerias): Promise<IOutput> {
    const createSerisas: ISerias = await this.SeriasService.createSerias(body);
    return {
      code: HttpCodes.OK,
      data: createSerisas,
    };
  }

  @Authorized(["admin", "manager"])
  @Put("/:id")
  @HttpCode(HttpCodes.OK)
  public async updateSerias(
    @Param("id") id: number,
    @Body() body: ISerias
  ): Promise<IOutput> {
    const updateSerias: ISerias = await this.SeriasService.updateSerias(
      id,
      body
    );
    return {
      code: HttpCodes.OK,
      data: updateSerias,
    };
  }

  @Authorized(["admin", "manager"])
  @Delete("/:id")
  @HttpCode(HttpCodes.OK)
  public async deleteSerias(@Param("id") id: number): Promise<IOutput> {
    const deleteSerias: ISerias = await this.SeriasService.deleteSerias(id);
    return {
      code: HttpCodes.OK,
      data: deleteSerias,
    };
  }
}

interface IOutput {
  code: HttpCodes;
  data: ISerias | ISerias[];
}
