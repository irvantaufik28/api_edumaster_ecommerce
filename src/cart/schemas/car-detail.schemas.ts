import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ProductDocument } from 'src/product/schemas/product.schemas';
import { CartDocument } from 'src/cart/schemas/cart.schemas';

export type CartDetailDocument = CartDetail & Document;

@Schema({
  timestamps: true,
})
export class CartDetail {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: ProductDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  cart: CartDocument;

  @Prop({ required: true })
  qty: number;

  @Prop()
  total_price: number;
}

export const CartDetailSchema = SchemaFactory.createForClass(CartDetail);
