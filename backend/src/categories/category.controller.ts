import { Controller, Post, Get, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Post()
  async createCategory(@Body() data) {
    const defaultCategoryName = data.name;
    return await this.categoryService.createCategory(defaultCategoryName);
  }
}
