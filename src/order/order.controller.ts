import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Query() query: ExpressQuery): Promise<any> {
    return await this.orderService.create(query);
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string): Promise<any> {
    return await this.orderService.findById(id);
  }
}
