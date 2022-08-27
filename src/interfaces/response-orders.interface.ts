import { StatusSales } from './../types/status-sales.models';

export interface ResponseOrdersData {
  id: number;
  product: string;
  salesValue: string;
  status: StatusSales;
  isActive: boolean;
}
