import { Controller, Body, Post, UseGuards, Get, Param } from '@nestjs/common';
import { LoginDto } from 'src/dto/login/login.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body() authLoginDto: LoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Post('logout/:id')
  async logOut(@Param(':id') id: number) {
    return this.authService.logOut(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('token/:id')
  async getToken(@Param('id') id: number) {
    return this.authService.getToken(id);
  }
}
