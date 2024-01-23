import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import mongoose from 'mongoose';
import { CartDetailDocument } from './car-detail.schemas';

export type CartDocument = Cart & Document;

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({ required: true })
  user_id: UUID;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartDetail' }] })
  cart_details: CartDetailDocument[];

  @Prop()
  total_product: number;

  @Prop()
  total_qty: number;

  @Prop()
  grand_total_price: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
