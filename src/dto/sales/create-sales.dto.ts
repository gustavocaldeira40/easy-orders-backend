import { IsNumber, IsString } from 'class-validator';

export class CreateSalesDto {
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
