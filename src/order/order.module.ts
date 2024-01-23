import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schemas';
import { OrderProductSchema } from './schemas/order-product.schemas';
import { CartSchema } from 'src/cart/schemas/cart.schemas';
import { CartDetailSchema } from 'src/cart/schemas/car-detail.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: 'OrderProduct', schema: OrderProductSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    MongooseModule.forFeature([
      { name: 'CartDetail', schema: CartDetailSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
