import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { UsersEntity } from 'src/entities/user.entity';

export class CreateClientsDto {
  @IsNumber()
  userId: UsersEntity;

  @IsString()
  socialReason: string;

  @Matches(
    /^([0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/,
    {
      message: 'Check that the document was inserted correctly',
    },
  )
  document: string;

  @IsOptional()
  // @IsPhoneNumber(null)
  phoneNumber?: string;

  @IsOptional()
  address: string;

  @IsOptional()
  number?: string;

  @IsOptional()
  complements?: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  country: string;
}
