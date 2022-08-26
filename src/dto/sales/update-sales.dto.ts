import { CreateSalesDto } from './create-sales.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';

export class UpdateSalesDto extends PartialType(CreateSalesDto) {
  @IsNumber()
  clientId: number;

  @IsNumber()
  userId: number;

  @IsString()
  product: string;

  @IsString()
  sales_value: string;

  @IsString()
  status: 'Waiting' | 'Approved';
}
