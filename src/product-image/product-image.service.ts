import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductImage,
  ProductImageDocument,
} from './schemas/product-image-schemas';
import { Model } from 'mongoose';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectModel(ProductImage.name)
    private productImageModel: Model<ProductImageDocument>,
  ) {}

  async create(data: ProductImage) {
    return await this.productImageModel.create(data);
  }

  async findAll(): Promise<ProductImage[]> {
    return await this.productImageModel.find();
  }
}
