import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductImageDocument = ProductImage & Document;

@Schema({
  timestamps: true,
})
export class ProductImage {
  @Prop({ default: false })
  is_main_image: boolean;

  @Prop({ required: true })
  image_url: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
