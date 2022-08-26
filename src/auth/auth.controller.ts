import { Controller, Body, Post, UseGuards, Get } from '@nestjs/common';
import { LoginDto } from 'src/dto/login/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() authLoginDto: LoginDto) {
    return this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test-jwt')
  async test() {
    return 'You have authorized!';
  }
}
