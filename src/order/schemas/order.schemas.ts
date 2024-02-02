import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import mongoose from 'mongoose';
import { OrderProductDocument } from './order-product.schemas';
export enum OrderStatus {
  PENDING = 'PENDING',
  NOT_PAID = 'NOT_PAID',
  PAID = 'PAID',
  DONE = 'DONE',
  CANCELED = 'CANCELDE',
}

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
})
export class Order {
  _id: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  user_id: UUID;

  @Prop({ required: false })
  nis: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ default: null })
  middle_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ default: null })
  current_classroom_id: string;

  @Prop({ required: true })
  family_identity_no: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderProduct' }],
  })
  order_products: OrderProductDocument[];

  @Prop()
  total_product: number;

  @Prop()
  total_qty: number;

  @Prop()
  grand_total_price: number;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ default: null })
  snap_token: string;

  @Prop({ default: null })
  snap_redirect_url: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
