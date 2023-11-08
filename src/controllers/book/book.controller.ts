import "reflect-metadata";
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
import { IAuthor, IBook } from "@interfaces/root.interface";
import { BookService } from "./book.service";

@JsonController("/book")
export class BookController {
  private readonly BookService;
  constructor() {
    this.BookService = new BookService();
  }

  @Get("")
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

  @Get("/:isbn")
  @HttpCode(HttpCodes.OK)
  public async getBookByISBN(@Param("isbn") isbn: string): Promise<IOutput> {
    const book: IBook = await this.BookService.getBookByISNB(isbn);
    return {
      code: HttpCodes.OK,
      data: book,
    };
  }

  @Authorized(["admin", "manager"])
  @Post("")
  @HttpCode(HttpCodes.CREATED)
  public async createBook(@Body() body: ICreateBook): Promise<IOutput> {
    const newBook = await this.BookService.createBook(body);
    return {
      code: HttpCodes.CREATED,
      data: newBook,
    };
  }

  @Authorized(["admin", "manager"])
  @Put("/:id")
  @HttpCode(HttpCodes.OK)
  public async updateBook(
    @Param("id") id: number,
    @Body() body: ICreateBook
  ): Promise<IOutput> {
    const update = await this.BookService.updateBook(id, body);
    return {
      code: HttpCodes.OK,
      data: update,
    };
  }

  @Authorized(["admin", "manager"])
  @Delete("/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  public async deleteBook(@Param("id") id: number): Promise<IOutput> {
    const deleteBook = await this.BookService.deleteBook(id);
    return {
      code: HttpCodes.NO_CONTENT,
      data: deleteBook,
    };
  }
}

interface ICreateBook extends IBook {
  author: IAuthor;
  categoryId: number[];
}

interface IOutput {
  code: HttpCodes;
  data: IBook | IBook[];
}
