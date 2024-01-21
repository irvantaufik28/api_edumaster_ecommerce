import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductImageModule } from './product-image/product-image.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { CartDetailModule } from './cart-detail/cart-detail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    ProductModule,
    CategoryModule,
    ProductImageModule,
    CartModule,
    OrderModule,
    PaymentModule,
    CartDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
