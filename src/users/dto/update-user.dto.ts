import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  isActive?: boolean;
}
