import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResponse } from './interface/payement.interface';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/order-paid/:id')
  async paidOrder(@Param('id') id: string): Promise<PaymentResponse> {
    return await this.paymentService.paidOrder(id);
  }
  @Post('/order-notification')
  async paymetNotification(@Body() paymentData: any): Promise<any> {
    return await this.paymentService.paymentNotif(paymentData);
  }
}
