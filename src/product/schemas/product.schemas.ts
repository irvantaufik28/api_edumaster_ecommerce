import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CategoryDocument } from '../../category/schemas/category.schemas';
import { ProductImageDocument } from '../../product-image/schemas/product-image-schemas';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
})
export class Product {
  _id: string;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: CategoryDocument;

  @Prop({ default: null })
  description: string;

  @Prop()
  price: number;

  @Prop()
  stock: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage' }],
    default: [],
  })
  product_images: ProductImageDocument[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
