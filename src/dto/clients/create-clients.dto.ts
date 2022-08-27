import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateClientsDto {
  @IsNumber()
  userId: number;

  @IsString()
  socialReason: string;

  @Matches(
    /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/,
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
