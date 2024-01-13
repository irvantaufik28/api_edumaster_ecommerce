import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CategoryDocument } from '../../category/schemas/category.schemas';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: CategoryDocument;

  @Prop()
  category_id: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
