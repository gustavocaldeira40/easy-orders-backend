import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { CreateClientsDto } from './create-clients.dto';

export class UpdateClientDto extends PartialType(CreateClientsDto) {
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
  @MaxLength(11)
  phoneNumber?: string;

  address: string;

  @IsOptional()
  number?: string;

  @IsOptional()
  complements?: string;

  city: string;

  state: string;

  country: string;
}
