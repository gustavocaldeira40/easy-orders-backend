import { StatusSales } from 'src/models/status-sales.models';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sales')
export class SalesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false })
  clientId: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: false })
  product: string;

  @Column({ nullable: false })
  sales_value: string;

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
