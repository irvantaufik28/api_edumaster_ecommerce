import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type OrderProductDocument = OrderProduct & Document;

@Schema({
  timestamps: true,
})
export class OrderProduct {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: null })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  qty: number;

  @Prop({ required: true })
  total_price: number;

  @Prop({ type: [{ is_main_image: Boolean, image_url: String }] })
  product_images: Array<{ is_main_image: boolean; image_url: string }>;
}

export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);
