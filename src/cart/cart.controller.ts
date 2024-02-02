import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateOrUpdateCartDto } from './dto/create-or-update-cart.dto';
import { CartResponse } from './interface/cart.interface';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async findCartByUser(@Query() query: ExpressQuery): Promise<CartResponse> {
    return this.cartService.findByUser(query);
  }

  @Post()
  async createCart(
    @Query() query: ExpressQuery,
    @Body() cart: CreateOrUpdateCartDto,
  ): Promise<CartResponse> {
    return this.cartService.addOrUpdateCart(query, cart);
  }

  @Delete('/cart-detail/:id')
  async deleteCartDetail(@Param('id') id: string): Promise<any> {
    return this.cartService.deleteCartDetail(id);
  }
}
