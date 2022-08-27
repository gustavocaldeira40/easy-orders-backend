import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrdersDto {
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
