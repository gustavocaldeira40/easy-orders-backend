import { ClientsAddressEntity } from './client-address.entity';
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

  @Column({ nullable: false, unique: true })
  social_reason: string;

  @Column({ nullable: false, unique: true })
  document: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

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

  @OneToMany(
    () => ClientsAddressEntity,
    (clients_address) => clients_address.clientId,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  clients_address: ClientsAddressEntity[];
}
