import { BookService } from "@controllers/book/book.service";
import { HttpCodes } from "@enums/HttpStatusCode";
import { AppError } from "@exceptions/AppError";
import { IBook } from "@interfaces/root.interface";

export class SearchService extends BookService {
  constructor() {
    super()
  }

  public async getSearch(payload: IPayload): Promise<IBook[]> {
    if (payload.maxResult && payload.maxResult > 60) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Max result not to exceed 60",
      });
    }

    if (payload && payload.book && payload.book.length <= 1) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Small search bar",
      });
    }

    if (payload.serias) {
      return this.getBookBySerias(
        payload.serias,
        payload.maxResult,
        payload.startIndex
      );
    }

    if (payload.category) {
      return this.getBookByCategory(
        payload.category,
        payload.maxResult,
        payload.startIndex
      );
    }

    if (payload.publisher) {
      return this.getBookByPublisher(
        payload.publisher,
        payload.maxResult,
        payload.startIndex
      );
    }

    const books: IBook[] = await this.prisma.books.findMany({
      where: {
        name: {
          contains: payload.book,
        },
      },
      take: payload.maxResult ? payload.maxResult : 30,
      skip: payload.startIndex,
    });

    const newBookWithCategoryAndAuthor: IBook[] =
      await this.getBookWithCategoryAndAuthor(books);

    return newBookWithCategoryAndAuthor;
  }
}

interface IPayload {
  book?: string;
  serias?: number;
  category?: number;
  publisher?: number;
  maxResult?: number;
  startIndex?: number;
}
