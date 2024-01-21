import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import mongoose from 'mongoose';
import { CartDetailDocument } from 'src/cart-detail/schemas/car-detail.schemas';

export type CartDocument = Cart & Document;

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({ required: true })
  user_id: UUID;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartDetail' }] })
  cart_details: CartDetailDocument[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
