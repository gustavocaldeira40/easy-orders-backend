import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post('findByEmail/:email')
  @UseGuards(JwtAuthGuard)
  async findByEmail(@Param('email') email: string) {
    console.log('TEM EMAIL ', email);
    return this.usersService.findUserByEmail(email);
  }

  @Post('verifyNickname/:nickname')
  async verifyNickname(@Param('nickname') nickname: string) {
    console.log('TEM nickname ', nickname);
    return this.usersService.verifyNickname(nickname);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
