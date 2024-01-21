import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImage } from './schemas/product-image-schemas';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';

@Controller('product-image')
export class ProductImageController {
  constructor(private productImageService: ProductImageService) {}

  @Get()
  async getAllProductImage(): Promise<ProductImage[]> {
    return await this.productImageService.findAll();
  }

  @Get('/:id')
  async getProductImageById(@Param('id') id: string): Promise<ProductImage> {
    return await this.productImageService.findById(id);
  }

  @Post()
  async createProductImage(
    @Body() productImage: CreateProductImageDto,
  ): Promise<ProductImage> {
    return await this.productImageService.create(productImage);
  }

  @Delete('/:id')
  async deleteProductImage(@Param('id') id: string): Promise<void> {
    return await this.productImageService.delete(id);
  }
  @Get('/:id')
  async updateProductImage(
    @Param('id') id: string,
    @Body() updateProductImage: UpdateProductImageDto,
  ): Promise<void> {
    return await this.productImageService.update(updateProductImage, id);
  }
}
