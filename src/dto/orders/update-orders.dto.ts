import { CreateOrdersDto } from './create-orders.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrdersDto extends PartialType(CreateOrdersDto) {
  @IsNumber()
  @IsOptional()
  clientId: number;

  @IsNumber()
  userId: number;

  @IsString()
  product: string;

  @IsString()
  salesValue: string;

  @IsString()
  @IsOptional()
  status: 'Waiting' | 'Approved';
}
