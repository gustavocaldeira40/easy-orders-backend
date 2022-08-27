import { OrdersEntity } from './orders.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UsersEntity } from './user.entity';

@Entity('clients')
export class ClientsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.clients)
  userId: number;

  @Column({ name: 'social_reason', nullable: false, unique: true })
  socialReason: string;

  @Column({ nullable: false, unique: true })
  document: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  number: string;

  @Column({ nullable: true })
  complements: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

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

  @OneToMany(() => OrdersEntity, (orders) => orders.clientId, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orders: OrdersEntity[];
}
