import { StatusSales } from 'src/types/status-sales.models';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientsEntity } from './client.entity';
import { UsersEntity } from './user.entity';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientsEntity, (client) => client.orders)
  clientId: ClientsEntity;

  @ManyToOne(() => UsersEntity, (user) => user.orders)
  userId: UsersEntity;

  @Column({ nullable: false })
  product: string;

  @Column({ nullable: false })
  salesValue: string;

  @Column({ default: 'Waiting' })
  status: StatusSales;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({ type: 'boolean', name: 'is_active', default: true, nullable: true })
  isActive: boolean;
}
