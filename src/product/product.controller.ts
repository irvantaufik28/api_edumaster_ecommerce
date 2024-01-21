import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import {
  ProductPaginationResult,
  ProductResponse,
} from './interface/product.response';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto ';
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getAllProduct(
    @Query() query: ExpressQuery,
  ): Promise<ProductPaginationResult> {
    return this.productService.findAll(query);
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string): Promise<ProductResponse> {
    return this.productService.getById(id);
  }

  @Post()
  async createProduct(
    @Body() product: CreateProductDto,
  ): Promise<ProductResponse> {
    return this.productService.create(product);
  }

  @Put('/:id')
  async updateProduct(
    @Body() product: UpdateProductDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productService.update(product, id);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
