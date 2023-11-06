import "reflect-metadata";
import {
  JsonController,
  Get,
  HttpCode,
  QueryParam,
} from "routing-controllers";
import { HttpCodes } from "@enums/HttpStatusCode";
import { IBook } from "@interfaces/root.interface";
import { SearchService } from "./search.service";

@JsonController("/search")
export class SearchController {
  private readonly SearchService;
  constructor() {
    this.SearchService = new SearchService();
  }

  @Get("")
  @HttpCode(HttpCodes.OK)
  public async getBookBySearch(
    @QueryParam("book") book?: string,
    @QueryParam("serias") serias?: number,
    @QueryParam("category") category?: number,
    @QueryParam("publisher") publisher?: number,
    @QueryParam("maxResult") maxResult?: number,
    @QueryParam("startIndex") startIndex?: number
  ): Promise<IOutput> {
    const payload = {
      book,
      serias,
      category,
      publisher,
      maxResult,
      startIndex,
    };

    const books: IBook[] = await this.SearchService.getSearch(payload)
    return {
      code: HttpCodes.OK,
      data: books,
    };
  }
}


interface IOutput {
    code: HttpCodes;
    data: IBook | IBook[];
  }
