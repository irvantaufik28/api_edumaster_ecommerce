import { Module } from '@nestjs/common';
import { CartDetailController } from './cart-detail.controller';
import { CartDetailService } from './cart-detail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartDetailSchema } from './schemas/car-detail.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CartDetail', schema: CartDetailSchema },
    ]),
  ],
  controllers: [CartDetailController],
  providers: [CartDetailService],
})
export class CartDetailModule {}
