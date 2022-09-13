import { UserFieldsResponse } from './../../dist/interfaces/user-fields-response.d';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/user.entity';
import { LoginDto } from 'src/dto/login/login.dto';
import { TokensEntity } from 'src/entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private repository: Repository<UsersEntity>,

    @InjectRepository(TokensEntity)
    private tokens_repository: Repository<TokensEntity>,

    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: LoginDto) {
    const { data } = await this.validateUser(authLoginDto);

    const payload = {
      userId: data.id,
    };

    const access_token = this.jwtService.sign(payload);

    //  SEARCH FOR UPDATE THE TOKEN
    const old_token = await this.getToken(data?.id);
    console.log('TOKEN OLD ', old_token);

    // IF HAS TOKEN , UPDATE IT
    if (old_token) {
      await this.tokens_repository.update(
        {
          userId: { id: data?.id },
        },
        { access_token: access_token, isAuthenticate: true },
      );
    }
    // SAVE FIRST ACCESS OF USER
    else {
      await this.tokens_repository.save({
        access_token,
        userId: { id: data?.id },
        isAuthenticate: true,
      });
    }

    return {
      user: data,
      access_token,
    };
  }

  async logOut(id: number) {
    const token = await this.tokens_repository.findOne({ where: { id } });

    token.isAuthenticate = false;

    const token_actually = await this.tokens_repository.save(token);

    return token_actually;
  }

  async getToken(id: number) {
    console.log('ID ', id);
    const token = await this.tokens_repository.findOne({
      where: { userId: { id } },
    });

    if (token) {
      // RETURN JUST ACCESS_TOKEN
      const { access_token } = token;

      return access_token;
    }

    if (!token) {
      return null;
    }
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
