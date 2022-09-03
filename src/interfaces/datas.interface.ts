import { StatusSales } from 'src/types/status-sales.models';

export interface OrdersData {
  status: StatusSales;
  userId?: number;
  clientId?: number;
}
