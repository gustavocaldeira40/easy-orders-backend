import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ClientsEntity } from 'src/entities/client.entity';
import { UsersEntity } from 'src/entities/user.entity';

export class CreateOrdersDto {
  @IsNumber()
  @IsOptional()
  clientId: ClientsEntity;

  @IsNumber()
  userId: UsersEntity;

  @IsString()
  product: string;

  @IsString()
  salesValue: string;

  @IsString()
  @IsOptional()
  status: 'Waiting' | 'Approved';
}
