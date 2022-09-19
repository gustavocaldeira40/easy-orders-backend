import { OrdersEntity } from './orders.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientsEntity } from './client.entity';
import { FilesEntity } from './files.entity';
import { TokensEntity } from './token.entity';
import { CodeVerificationEntity } from './code-verification.entity';
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

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
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

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'boolean', name: 'is_active', default: true, nullable: true })
  isActive: boolean;

  @OneToMany(() => ClientsEntity, (client) => client.userId, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  clients: ClientsEntity[];

  @OneToMany(() => TokensEntity, (token) => token.userId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  tokens: TokensEntity[];

  @OneToMany(() => OrdersEntity, (order) => order.userId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orders: OrdersEntity[];

  @OneToMany(() => CodeVerificationEntity, (code) => code.userId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  codes: CodeVerificationEntity[];

  @OneToOne(() => FilesEntity, { cascade: true })
  @JoinColumn()
  avatar: FilesEntity;
}
