import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDTO {
  @IsOptional()
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
