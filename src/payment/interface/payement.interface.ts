import { Payment } from '../schemas/payment.schema';

export interface PaymentResponse {
  data: Payment;
}

export interface PaymentPaginationResult {
  data: Payment[];
  paging: {
    page: number;
    total_item: number;
    total_page: number;
  };
}
