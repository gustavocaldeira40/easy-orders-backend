import { CreateOrdersDto } from './create-orders.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ClientsEntity } from 'src/entities/client.entity';
import { UsersEntity } from 'src/entities/user.entity';

export class UpdateOrdersDto extends PartialType(CreateOrdersDto) {
  @IsOptional()
  clientId: ClientsEntity;

  userId: UsersEntity;

  @IsString()
  product: string;

  @IsString()
  salesValue: string;

  @IsString()
  @IsOptional()
  status: 'Waiting' | 'Approved';
}
