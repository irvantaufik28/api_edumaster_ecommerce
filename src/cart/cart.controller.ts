import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getAllCart(@Query() query: ExpressQuery): Promise<any> {
    return this.cartService.findAll(query);
  }

  @Post()
  async createCart(
    @Query() query: ExpressQuery,
    @Body() cart: any,
  ): Promise<any> {
    return this.cartService.create(query, cart);
  }
}
