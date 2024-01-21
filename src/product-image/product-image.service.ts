import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductImage,
  ProductImageDocument,
} from './schemas/product-image-schemas';
import { Model } from 'mongoose';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectModel(ProductImage.name)
    private productImageModel: Model<ProductImageDocument>,
  ) {}

  async create(productImage: ProductImage): Promise<ProductImage> {
    return await this.productImageModel.create(productImage);
  }

  async findAll(): Promise<ProductImage[]> {
    return await this.productImageModel.find();
  }
  async findById(id: string): Promise<ProductImage> {
    const productimage = await this.productImageModel.findById(id);

    if (!productimage) {
      throw new HttpException('Product image not found', HttpStatus.NOT_FOUND);
    }

    return productimage;
  }

  async delete(id: string): Promise<any> {
    const productimage = await this.productImageModel.findById(id);

    if (!productimage) {
      throw new HttpException('Product image not found', HttpStatus.NOT_FOUND);
    }
    await this.productImageModel.deleteOne({ _id: id });
    return { message: 'product image succesfully deleted' };
  }

  async update(
    updateProductImage: UpdateProductImageDto,
    id: string,
  ): Promise<any> {
    const productimage = await this.productImageModel.findById(id);

    if (!productimage) {
      throw new HttpException('Product image not found', HttpStatus.NOT_FOUND);
    }
    await this.productImageModel.updateOne({ _id: id }, updateProductImage);
    return { message: 'product image succesfully deleted' };
  }
}
