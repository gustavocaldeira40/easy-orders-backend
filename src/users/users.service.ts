import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFieldsResponse } from 'src/interfaces/user-fields-response';
import { FindOptionsSelect, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { userQuery } from 'src/query/users.query';
import { UsersEntity } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private repoUsers: Repository<UsersEntity>,
  ) {}

  async create(@Body() data: CreateUserDto): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: UserFieldsResponse;
  }> {
    const users = await this.repoUsers.findOne({
      where: { email: data.email },
    });

    if (users) {
      throw new HttpException('User already exists !', HttpStatus.NOT_FOUND);
    }

    const user = this.repoUsers.create(data);
    user.password = await await bcrypt.hash(user.password, saltOrRounds);
    const saveUser: UserFieldsResponse = await this.repoUsers.save(user);

    // Seleciona para retorno somente dos campos determinados e necessarios
    const { id, name, nickname, email, isActive } = saveUser;

    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      data: { id, name, nickname, email, isActive },
    };
  }

  async findAll(): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: UsersEntity[];
  }> {
    const users = await this.repoUsers.find({
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  async findOne(@Param('id') id: number): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: UsersEntity;
  }> {
    const users = await this.repoUsers.findOne({
      where: { id: id },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });

    try {
      return {
        statusCode: HttpStatus.OK,
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException('User not found !', HttpStatus.NOT_FOUND);
    }
  }

  async findUserByEmail(email: string): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: UsersEntity;
  }> {
    try {
      const user = await this.repoUsers.findOne({
        where: { email },
        select: userQuery as FindOptionsSelect<UsersEntity>,
      });

      if (!user) {
        throw new HttpException("User don't Exist !", HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Users fetched successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException('User not found !', HttpStatus.NOT_FOUND);
    }
  }

  async verifyNickname(nickname: string): Promise<boolean> {
    const user = await this.repoUsers.findOne({
      where: { nickname: nickname },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });

    if (user) {
      // Nickname not avaliable
      return false;
    }
    // Avaliable Nickname
    return true;
  }

  async update(id: number, data: UpdateUserDto) {
    await this.repoUsers.update({ id }, data);
    return await this.repoUsers.findOne({
      where: { id: id },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });
  }

  async remove(id: number) {
    await this.repoUsers.findOne({ where: { id: id } });
    this.repoUsers.softDelete({ id });
  }
}
