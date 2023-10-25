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
  QueryParam,
} from "routing-controllers";
import { HttpCodes } from "@enums/HttpStatusCode";
import { IBook } from "@interfaces/root.interface";
import { BookService } from "./book.service";

@JsonController("/book")
export class Book {
  private readonly BookService;
  constructor() {
    this.BookService = new BookService();
  }

  @Get("/all/")
  @HttpCode(HttpCodes.OK)
  public async getAllBook(
    @QueryParam("startIndex") startIndex: number | undefined,
    @QueryParam("maxResult") maxResult: number | undefined
  ): Promise<any> {
    return {
      code: HttpCodes.OK,
      data: {},
    };
  }

  @Get("/:id")
  @HttpCode(HttpCodes.OK)
  public async getBookById(@Param("id") id: number) {
    return {
      code: HttpCodes.OK,
      data: {},
    };
  }

  @Get("/search/isbn/:isbn")
  @HttpCode(HttpCodes.OK)
  public async getBookByISBN(@Param("isbn") isbn: string): Promise<any> {
    return {
      code: HttpCodes.OK,
      data: {},
    };
  }

  @Get("/search/?")
  @HttpCode(HttpCodes.OK)
  public async getBookBySearch(
    @QueryParam("name") name?: string,
    @QueryParam("author") author?: string,
    @QueryParam("serias") serias?: string,
    @QueryParam("publisher") publisher?: string,
    @QueryParam("category") category?: string
  ): Promise<any> {
    return {
      code: HttpCodes.OK,
      data: {},
    };
  }

  @Authorized(["admin", "manager"])
  @Post("/create")
  @HttpCode(HttpCodes.CREATED)
  public async createBook(@Body() body: IBook): Promise<any> {
    return {
      code: HttpCodes.CREATED,
      data: {},
    };
  }

  @Authorized(["admin", "manager"])
  @Put("/update/:id")
  @HttpCode(HttpCodes.OK)
  public async updateBook(
    @Param("id") id: number,
    @Body() body: IBook
  ): Promise<any> {
    return {
      code: HttpCodes.OK,
      data: {},
    };
  }

  @Authorized(["admin", "manager"])
  @Delete("/remove/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  public async deleteBook(@Param("id") id: number): Promise<any> {
    return {
      code: HttpCodes.NO_CONTENT,
      data: {},
    };
  }
}
