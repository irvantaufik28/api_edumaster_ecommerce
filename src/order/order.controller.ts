import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import {
  OrderPaginationResult,
  OrderResponse,
} from './interface/order.interface';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Query() query: ExpressQuery): Promise<OrderResponse> {
    return await this.orderService.create(query);
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string): Promise<OrderResponse> {
    return await this.orderService.findById(id);
  }

  @Get()
  async getAllOrder(
    @Query() query: ExpressQuery,
  ): Promise<OrderPaginationResult> {
    return this.orderService.findAll(query);
  }
}
