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
import { ICategory } from "@interfaces/root.interface";

@JsonController("/category")
export class CategoryController {
  private CategoryService;
  constructor() {
    this.CategoryService = new CategoryService();
  }

  @Get("")
  @HttpCode(HttpCodes.OK)
  public async getAllCategory(): Promise<IOutput> {
    const allCategory: ICategory[] =
      await this.CategoryService.getAllCategory();
    return {
      code: HttpCodes.OK,
      data: allCategory,
    };
  }

  @Authorized(["admin", "manager"])
  @Post("")
  @HttpCode(HttpCodes.CREATED)
  public async createCategory(@Body() body: ICategory): Promise<IOutput> {
    const newCategory: ICategory = await this.CategoryService.createCategory(
      body
    );

    return {
      code: HttpCodes.CREATED,
      data: newCategory,
    };
  }

  @Authorized(["admin", "manager"])
  @Put("/:id")
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
      data: updateCategory,
    };
  }

  @Authorized(["admin", "manager"])
  @Delete("/:id")
  @HttpCode(HttpCodes.NO_CONTENT)
  public async deleteCategory(@Param("id") id: number): Promise<IOutput> {
    const deleteCategory: ICategory = await this.CategoryService.deleteCaregory(
      id
    );

    return {
      code: HttpCodes.NO_CONTENT,
      data: deleteCategory,
    };
  }
}

interface IOutput {
  code: HttpCodes;
  data: ICategory | ICategory[];
}
