import {
  JsonController,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  HttpCode,
  Authorized,
  QueryParam,
} from "routing-controllers";
import { HttpCodes } from "@enums/HttpStatusCode";
import { AuthorService } from "./author.service";
import { IAuthor } from "@interfaces/root.interface";

@JsonController("/author")
export class AuthorController {
  private AuthorService;
  constructor() {
    this.AuthorService = new AuthorService();
  }

  public test(){
    console.log("true")
  }

  @Get("/all/")
  @HttpCode(HttpCodes.OK)
  public async getAllAuthor(
    @QueryParam("startIndex") startIndex: number | undefined,
    @QueryParam("maxResult") maxResult: number | undefined
  ): Promise<IOutput> {
    const author = await this.AuthorService.getAllAuthor(startIndex, maxResult);
    return {
      code: HttpCodes.OK,
      data: author,
    };
  }

  @Get("/:id")
  @HttpCode(HttpCodes.OK)
  public async getAuthor(@Param("id") id: number): Promise<IOutput> {
    const author: IAuthor = await this.AuthorService.getAuthor(id);
    return {
      code: HttpCodes.OK,
      data: author,
    };
  }

  @Authorized(["admin", "manager"])
  @Post("/create")
  @HttpCode(HttpCodes.CREATED)
  public async createAuthor(@Body() body: IAuthor): Promise<IOutput> {
    const newAuthor: IAuthor = await this.AuthorService.createAuthor(body);
    return {
      code: HttpCodes.OK,
      data: newAuthor,
    };
  }

  @Authorized(["admin", "manager"])
  @Put("/update/:id")
  @HttpCode(HttpCodes.OK)
  public async updateAuthor(
    @Param("id") id: number,
    @Body() body: IAuthor
  ): Promise<IOutput> {
    const updateAuthor: IAuthor = await this.AuthorService.updateAuthor(
      id,
      body
    );
    return {
      code: HttpCodes.OK,
      data: updateAuthor,
    };
  }

  @Authorized(["admin", "manager"])
  @Delete("/remove/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  public async deleteAuthor(@Param("id") id: number): Promise<IOutput> {
    const deleteAuthor: IAuthor = await this.AuthorService.deleteAuthor(id);
    return {
      code: HttpCodes.OK,
      data: deleteAuthor,
    };
  }
}

interface IOutput {
  code: HttpCodes;
  data: IAuthor | IAuthor[];
}
