import {
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  HttpCode,
  Authorized,
  Param,
  Body,
} from "routing-controllers";
import { PublisherService } from "./publisher.service";
import { HttpCodes } from "@enums/HttpStatusCode";
import { IPublisher } from "@interfaces/root.interface";

@JsonController("/publisher")
export class PublisherController {
  private PublisherService;
  constructor() {
    this.PublisherService = new PublisherService();
  }

  @Get("/all")
  @HttpCode(HttpCodes.OK)
  public async getAllPublsher(): Promise<IOutput> {
    const publishers: IPublisher[] =
      await this.PublisherService.getAllPublsiher();
    return {
      code: HttpCodes.OK,
      data: publishers,
    };
  }

  @Get("/:id")
  @HttpCode(HttpCodes.OK)
  public async getPublisher(@Param("id") id: number): Promise<IOutput> {
    const publisher: IPublisher = await this.PublisherService.getPublisher(id);
    return {
      code: HttpCodes.OK,
      data: publisher,
    };
  }

  @Authorized(["admin", "manager"])
  @Post("/create")
  @HttpCode(HttpCodes.CREATED)
  public async createPublisher(@Body() body: IPublisher): Promise<IOutput> {
    const newPublisher: IPublisher =
      await this.PublisherService.createPublisher(body);
    return {
      code: HttpCodes.CREATED,
      data: newPublisher,
    };
  }

  @Authorized(["admin", "manager"])
  @Put("/:id")
  @HttpCode(HttpCodes.OK)
  public async updatePublisher(
    @Param("id") id: number,
    @Body() body: IPublisher
  ): Promise<IOutput> {
    const updatePublisher: IPublisher =
      await this.PublisherService.updatePublisher(body, id);
    return {
      code: HttpCodes.OK,
      data: updatePublisher,
    };
  }

  @Authorized(["admin", "manager"])
  @Delete("/remove/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  public async deletePublisher(@Param("id") id: number): Promise<IOutput> {
    const deletePublisher: IPublisher =
      await this.PublisherService.deletePublisher(id);
    return {
      code: HttpCodes.NO_CONTENT,
      data: deletePublisher,
    };
  }
}

interface IOutput {
  code: HttpCodes;
  data: IPublisher | IPublisher[];
}
