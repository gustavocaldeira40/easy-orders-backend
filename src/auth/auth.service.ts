import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: UsersEntity): Promise<any> {
    const { email, password } = data;
    const user = await this.usersService.findUserByEmail(email);

    const passwordCorrect = await bcrypt.compare(user.data.password, password);

    if (passwordCorrect) {
      const { password, ...result } = user.data;
      return result;
    }
    return null;
  }

  async login(user: UsersEntity) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
