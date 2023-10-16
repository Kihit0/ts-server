import {
  JsonController,
  HttpCode,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Authorized
} from "routing-controllers";
import { CategoryService } from "./category.service";
import { HttpCodes } from "@enums/HttpStatusCode";
import { ICategory } from "@interfaces/category.interface";

@JsonController("/category")
export class CategoryController {
  private CategoryService;
  constructor() {
    this.CategoryService = new CategoryService();
  }

  @Get("/all")
  @HttpCode(HttpCodes.OK)
  public async getAllCategory(): Promise<IOutput> {
    const allCategory: ICategory[] =
      await this.CategoryService.getAllCategory();
    return {
      code: HttpCodes.OK,
      date: allCategory,
    };
  }

  @Authorized(["admin", "manager"])
  @Post("/create")
  @HttpCode(HttpCodes.CREATED)
  public async createCategory(@Body() body: ICategory): Promise<IOutput> {
    const newCategory: ICategory = await this.CategoryService.createCategory(
      body
    );

    return {
      code: HttpCodes.CREATED,
      date: newCategory,
    };
  }

  @Authorized(["admin", "manager"])
  @Put("/update/:id")
  @HttpCode(HttpCodes.OK)
  public async updateCategory(
    @Param("id") id: number,
    @Body() body: ICategory
  ): Promise<IOutput> {
    const updateCategory: ICategory = await this.CategoryService.updateCategory(
      id,
      body
    );

    return {
      code: HttpCodes.OK,
      date: updateCategory,
    };
  }

  @Authorized(["admin", "manager"])
  @Delete("/remove/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  public async deleteCategory(@Param("id") id: number): Promise<IOutput> {
    const deleteCategory: ICategory = await this.CategoryService.deleteCaregory(
      id
    );

    return {
      code: HttpCodes.NO_CONTENT,
      date: deleteCategory,
    };
  }
}

interface IOutput {
  code: HttpCodes;
  date: ICategory | ICategory[];
}
