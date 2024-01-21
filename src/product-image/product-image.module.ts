import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductImageSchema } from './schemas/product-image-schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ProductImage', schema: ProductImageSchema },
    ]),
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
