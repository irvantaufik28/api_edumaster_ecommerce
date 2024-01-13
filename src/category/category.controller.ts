import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schemas/category.schemas';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAllCategory(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Post()
  async createProduct(@Body() category: Category): Promise<Category> {
    return await this.categoryService.create(category);
  }
}
