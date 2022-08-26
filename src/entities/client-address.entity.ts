import { ClientsEntity } from 'src/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clients-address')
export class ClientsAddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientsEntity, (clients) => clients.clients_address)
  clientId: number;

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
}
