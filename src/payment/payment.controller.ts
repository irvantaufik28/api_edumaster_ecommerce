import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  PaymentPaginationResult,
  PaymentResponse,
} from './interface/payement.interface';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  async getAllPayment(
    @Query() query: ExpressQuery,
  ): Promise<PaymentPaginationResult> {
    return this.paymentService.findAll(query);
  }

  @Get('/:id')
  async getPaymentById(@Param('id') id: string): Promise<PaymentResponse> {
    return this.paymentService.getById(id);
  }

  @Post('/order-paid/:id')
  async paidOrder(@Param('id') id: string): Promise<PaymentResponse> {
    return await this.paymentService.paidOrder(id);
  }
  @Post('/order-notification')
  async paymetNotification(@Body() paymentData: any): Promise<any> {
    return await this.paymentService.paymentNotif(paymentData);
  }
}
