import { Product } from '../schemas/product.schemas';

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
