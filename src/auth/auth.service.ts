import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/user.entity';
import { LoginDto } from 'src/dto/login/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private repository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: LoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.data.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      statusCode: HttpStatus.OK,
    };
  }

  async validateUser(userLoginDto: LoginDto): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: any;
  }> {
    const { email, password } = userLoginDto;

    const user = await this.repository.findOne({ where: { email } });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!(await validPassword)) {
      throw new UnauthorizedException();
    }

    if (await validPassword) {
      user.lastLoginAt = new Date();
      // Save the field lastLoginAt
      await this.repository.save(user);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: user,
    };
  }
}
