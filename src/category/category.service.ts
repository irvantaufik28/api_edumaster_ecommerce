import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './schemas/category.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: CreateCategoryDto) {
    return await this.categoryModel.create(data);
  }

  async findById(_id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id });
    if (!category) {
      throw new HttpException('category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async findAll(): Promise<Category[]> {
    const category = await this.categoryModel.find();
    return category;
  }
}
