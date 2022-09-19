import { ClientsEntity } from 'src/entities/client.entity';
import { OrdersEntity } from 'src/entities/orders.entity';

export interface ValidateUserData {
  id: number;
  name: string;
  email: string;
  nickname: string;
  address?: string;
  number?: string;
  complements?: string;
  city?: string;
  state?: string;
  country?: string;
  clients: ClientsEntity[];
  orders: OrdersEntity[];
  birthday: Date;
}
