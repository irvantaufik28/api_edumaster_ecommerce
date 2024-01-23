import { Category } from 'src/category/schemas/category.schemas';
import { Product } from '../schemas/product.schemas';
import { ProductImage } from 'src/product-image/schemas/product-image-schemas';

export interface ProductPaginationResult {
  data: Product[];
  paging: {
    page: number;
    total_item: number;
    total_page: number;
  };
}

export interface ProductResponse {
  data: Product;
}

export interface ProductUpdateResponse {
  message: string;
}

export interface ProductDocumentInterFace extends Document {
  _id: string;
  name: string;
  category: Category; // Assuming category is also an ObjectId, adjust as needed
  description: string;
  price: number;
  stock: number;
  product_images: ProductImage[]; // Adjust the type of product_images as needed
  createdAt: Date;
  updatedAt: Date;
  // Add other properties as needed
}
