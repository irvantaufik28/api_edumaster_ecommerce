import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schemas/category.schemas';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAllCategory(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findById(id);
  }

  @Post()
  async createProduct(@Body() category: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(category);
  }
}
