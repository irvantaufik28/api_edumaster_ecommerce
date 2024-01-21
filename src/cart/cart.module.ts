import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartDetailSchema } from 'src/cart-detail/schemas/car-detail.schemas';
import { CartSchema } from './schemas/cart.schemas';
import { ProductSchema } from 'src/product/schemas/product.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    MongooseModule.forFeature([
      { name: 'CartDetail', schema: CartDetailSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
