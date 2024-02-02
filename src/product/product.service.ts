import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schemas';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category.schemas';
import { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import {
  ProductPaginationResult,
  ProductResponse,
} from './interface/product.response';
import ApiResponse from 'src/common/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto ';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(query: Query): Promise<ProductPaginationResult> {
    const page = Number(query.page) || 1;
    const size = Number(query.size) || 10;
    const skip = size * (page - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: new RegExp(String(query.keyword), 'i'),
          },
        }
      : {};

    const categoryFilter = query.category
      ? {
          'category.name': {
            $regex: new RegExp(String(query.category), 'i'),
          },
        }
      : {};

    const totalItems = await this.productModel.find({
      ...keyword,
      ...categoryFilter,
    });

    const products = await this.productModel
      .find({ ...keyword, ...categoryFilter })
      .limit(size)
      .skip(skip)
      .populate('product_images')
      .populate('category')
      .exec();

    const result = {
      data: products,
      paging: {
        page: page,
        total_item: totalItems.length,
        total_page: Math.ceil(totalItems.length / size),
      },
    };

    return result;
  }

  async getById(id: string): Promise<ProductResponse> {
    const product = await this.productModel
      .findById(id)
      .populate('product_images')
      .populate('category');

    if (!product) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }

    return new ApiResponse(product);
  }

  async create(product: CreateProductDto): Promise<ProductResponse> {
    const createdProduct = new this.productModel({
      name: product.name,
      category: product.category_id,
      description: product.description,
      price: product.price,
      stock: product.stock,
      product_images: product.product_images,
    });

    const savedProduct = await createdProduct.save();
    return new ApiResponse(savedProduct);
  }

  async update(updateProduct: UpdateProductDto, id: string): Promise<any> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }

    await this.productModel.updateOne({ _id: id }, updateProduct);
    return { message: 'product succesfully updated' };
  }

  async delete(id: string): Promise<any> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }

    await this.productModel.deleteOne({ _id: id });
    return { message: 'product succesfully deleted' };
  }
}
