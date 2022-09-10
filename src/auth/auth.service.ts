import { UserFieldsResponse } from './../../dist/interfaces/user-fields-response.d';
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
    const { data } = await this.validateUser(authLoginDto);

    const payload = {
      userId: data.id,
    };

    return {
      user: data,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userLoginDto: LoginDto): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: UserFieldsResponse;
  }> {
    const user: UsersEntity = await this.repository.findOne({
      where: { email: userLoginDto.email, nickname: userLoginDto.nickname },
    });

    const validPassword = await bcrypt.compare(
      userLoginDto.password,
      user.password,
    );

    if (!(await validPassword)) {
      throw new UnauthorizedException();
    }

    if (await validPassword) {
      user.lastLoginAt = new Date();
      // Save the field lastLoginAt
      await this.repository.save(user);
    }

    const {
      id,
      name,
      nickname,
      email,
      address,
      number,
      complements,
      city,
      state,

      clients,
      orders,
      birthday,
      isActive,
    } = user;

    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: {
        id,
        name,
        nickname,
        email,
        address,
        number,
        complements,
        city,
        state,

        clients,
        orders,
        birthday,
        isActive,
      } as UserFieldsResponse,
    };
  }
}
