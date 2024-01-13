import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './schemas/category.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: Category) {
    return await this.categoryModel.create(data);
  }

  async findAll(): Promise<Category[]> {
    const category = await this.categoryModel.find();
    return category;
  }
}
