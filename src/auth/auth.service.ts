import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/user.entity';
import { LoginDto } from 'src/dto/login/login.dto';
import { TokensEntity } from 'src/entities/token.entity';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { ResponseUsersData } from 'src/interfaces/response-users.interface';
import { HttpException } from '@nestjs/common/exceptions';
import { Body } from '@nestjs/common/decorators';
import { MailService } from 'src/mail/mail.service';
import { ValidateUserData } from 'src/interfaces/validate-user';

const saltOrRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private repository: Repository<UsersEntity>,

    @InjectRepository(TokensEntity)
    private tokens_repository: Repository<TokensEntity>,

    private mailService: MailService,

    private jwtService: JwtService,
  ) {}

  // Register
  async create(@Body() data: CreateUserDto): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: ResponseUsersData;
  }> {
    const users = await this.repository.findOne({
      where: { email: data.email },
    });

    if (users) {
      throw new HttpException('User already exists !', HttpStatus.CONFLICT);
    }

    const user = this.repository.create(data);
    user.password = await await bcrypt.hash(user.password, saltOrRounds);
    const saveUser: ResponseUsersData = await this.repository.save(user);

    // Seleciona para retorno somente dos campos determinados e necessarios
    const {
      id,
      name,
      email,
      nickname,
      address,
      number,
      complements,
      city,
      state,
      country,
      clients,
      orders,
      isActive,
    } = saveUser;

    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      data: {
        id,
        name,
        email,
        nickname,
        address,
        number,
        complements,
        city,
        state,
        country,
        clients,
        orders,
        isActive,
      },
    };
  }

  async forgotPassword(data: any) {
    const user = await this.repository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException(
        'No registered user in email',
        HttpStatus.NOT_FOUND,
      );
    }

    // If send return true if not return false
    const send = await this.mailService.sendUserPasswordReset(user);

    return { send };
  }

  async login(authLoginDto: LoginDto) {
    const { data } = await this.validateUser(authLoginDto);

    const payload = {
      userId: data.id,
    };

    const access_token = this.jwtService.sign(payload);

    //  SEARCH FOR UPDATE THE TOKEN
    const old_token = await this.getToken(data?.id);

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
    const token = await this.tokens_repository.findOne({
      where: { userId: { id } },
    });

    if (token) {
      // RETURN JUST ACCESS_TOKEN
      const { access_token, isAuthenticate } = token;

      return { access_token, isAuthenticate };
    }

    if (!token) {
      return null;
    }
  }

  async validateUser(userLoginDto: LoginDto): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: ValidateUserData;
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
      },
    };
  }
}
