import { SalesEntity } from './sale.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientsEntity } from './client.entity';
import { UsersAddressEntity } from './user-address';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  email: string;

  // @Column({ select: false })
  @Column()
  password: string;

  @Column({ nullable: true })
  birthday?: Date;

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

  @Column({ type: 'timestamp', nullable: true, default: null })
  lastLoginAt: Date | null;

  @Column({ type: 'boolean', name: 'is_active', default: true, nullable: true })
  isActive: boolean;

  @OneToMany(() => ClientsEntity, (client) => client.userId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  clients: ClientsEntity[];

  @OneToMany(() => SalesEntity, (sales) => sales.userId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sales: SalesEntity[];

  @OneToMany(
    () => UsersAddressEntity,
    (users_address) => users_address.userId,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  users_address: UsersAddressEntity[];
}
