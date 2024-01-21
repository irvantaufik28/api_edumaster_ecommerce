import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImage } from './schemas/product-image-schemas';

@Controller('product-image')
export class ProductImageController {
  constructor(private productImageService: ProductImageService) {}

  @Get()
  async getAllProductImage(): Promise<ProductImage[]> {
    return await this.productImageService.findAll();
  }

  @Post()
  async createProductImage(
    @Body() productImage: ProductImage,
  ): Promise<ProductImage> {
    return await this.productImageService.create(productImage);
  }
}
