import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsPhoneNumber, IsString, Matches } from 'class-validator';
import { CreateClientsDto } from './create-clients.dto';

export class UpdateClientDto extends PartialType(CreateClientsDto) {
  @IsString()
  socialReason: string;

  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, {
    message: 'Check that the document was inserted correctly',
  })
  document: string;

  @IsOptional()
  @IsPhoneNumber(null)
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
