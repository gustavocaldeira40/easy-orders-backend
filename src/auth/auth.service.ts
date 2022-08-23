import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { UsersEntity } from 'src/users/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private repoUsers: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: LoginDTO) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.data.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      statusCode: HttpStatus.OK,
    };
  }

  async validateUser(userLoginDto: LoginDTO): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: any;
  }> {
    const { email, password } = userLoginDto;

    const user = await this.repoUsers.findOne({ where: { email } });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!(await validPassword)) {
      throw new UnauthorizedException();
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: user,
    };
  }
}
