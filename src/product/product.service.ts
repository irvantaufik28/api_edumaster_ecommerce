import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schemas';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category.schemas';
import { Model } from 'mongoose';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().populate('category').exec();
    return products;
  }

  async create(product: Product): Promise<Product> {
    const category = await this.categoryModel
      .findById(product.category_id)
      .exec();

    if (!category) {
      throw new Error(`Category with ID ${product.category_id} not found`);
    }

    product.category = category._id;

    const createdProduct = await this.productModel.create(product);
    return createdProduct;
  }
}
