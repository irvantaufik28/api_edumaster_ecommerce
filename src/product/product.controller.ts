import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schemas';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getAllProduct(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }
}
