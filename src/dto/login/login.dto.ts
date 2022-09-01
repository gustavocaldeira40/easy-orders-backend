import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  nickname: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  password: string;
}
