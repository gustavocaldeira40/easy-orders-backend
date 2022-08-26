import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  address: string;

  @IsOptional()
  number?: string;

  @IsOptional()
  complements?: string;

  city: string;

  state: string;

  country: string;

  @IsOptional()
  birthday?: Date;
}
