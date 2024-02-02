import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { OrderDocument } from 'src/order/schemas/order.schemas';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'PENDING',
  NOT_PAID = 'NOT_PAID',
  CANCELED = 'CANCELED',
  PAID = 'PAID',
  DONE = 'DONE',
}

@Schema({
  timestamps: true,
})
export class Payment {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  })
  order_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true })
  customer_nis: string;

  @Prop({ required: true })
  customer_name: string;

  @Prop({ default: null })
  payment_method: string;

  @Prop({ default: null })
  payment_type: string;

  @Prop({ required: true })
  gross_amount: number;

  @Prop({ required: true })
  snap_token: string;

  @Prop({ required: true })
  snap_redirect_url: string;

  @Prop({
    type: String,
    enum: Object.values(Payment),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  })
  order: OrderDocument;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
