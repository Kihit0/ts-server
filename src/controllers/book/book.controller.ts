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
export class BookController {
  private readonly BookService;
  constructor() {
    this.BookService = new BookService();
  }

  @Get("/all")
  @HttpCode(HttpCodes.OK)
  public async getAllBook(
    @QueryParam("startIndex") startIndex: number | undefined,
    @QueryParam("maxResult") maxResult: number | undefined
  ): Promise<IOutput> {
    const books: IBook[] = await this.BookService.getAllBook(
      startIndex,
      maxResult
    );
    return {
      code: HttpCodes.OK,
      data: books,
    };
  }

  @Get("/:id")
  @HttpCode(HttpCodes.OK)
  public async getBookById(@Param("id") id: number): Promise<IOutput> {
    const book: IBook = await this.BookService.getBookById(id);
    return {
      code: HttpCodes.OK,
      data: book,
    };
  }

  @Get("/search/isbn/:isbn")
  @HttpCode(HttpCodes.OK)
  public async getBookByISBN(@Param("isbn") isbn: string): Promise<IOutput> {
    const book: IBook = await this.BookService.getBookByISNB(isbn);
    return {
      code: HttpCodes.OK,
      data: book,
    };
  }

  @Get("/search")
  @HttpCode(HttpCodes.OK)
  public async getBookBySearch(
    @QueryParam("book") book: string,
    @QueryParam("serias") serias: number,
    @QueryParam("category") category: number,
    @QueryParam("publisher") publisher: number,
    @QueryParam("maxResult") maxResult: number,
    @QueryParam("startIndex") startIndex: number
  ): Promise<IOutput> {
    const payload = {
      book,
      serias,
      category,
      publisher,
      maxResult,
      startIndex,
    };

    const books: IBook[] = await this.BookService.getBookBySearch(payload)
    return {
      code: HttpCodes.OK,
      data: books,
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

interface IOutput {
  code: HttpCodes;
  data: IBook | IBook[];
}
