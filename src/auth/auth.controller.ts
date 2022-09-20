import { Controller, Body, Post, UseGuards, Get, Param } from '@nestjs/common';
import { LoginDto } from 'src/dto/login/login.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { ForgotPasswordData } from 'src/interfaces/forgot-password.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() data: ForgotPasswordData) {
    return this.authService.forgotPassword(data);
  }

  @Post('/verify-code/:code')
  verifyCode(@Param('code') code: number) {
    return this.authService.verifyCode(code);
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
