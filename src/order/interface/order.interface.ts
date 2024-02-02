import { Order } from '../schemas/order.schemas';

export interface OrderResponse {
  data: Order;
}

export interface OrderPaginationResult {
  data: Order[];
  paging: {
    page: number;
    total_item: number;
    total_page: number;
  };
}
