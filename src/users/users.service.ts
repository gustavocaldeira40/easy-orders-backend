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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { userQuery } from 'src/query/users.query';

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

  async findOne(@Param('id') id: string): Promise<{
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

  async verifyNickname(nickname: string): Promise<{
    statusCode: HttpStatus;
    message: string;
  }> {
    const response = await this.repoUsers.findOne({
      where: { nickname: nickname },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });

    if (response) {
      throw new HttpException('Nickname Used !', HttpStatus.CONFLICT);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Nickname Avaliable',
    };
  }

  async update(id: string, data: UpdateUserDto) {
    await this.repoUsers.update({ id }, data);
    return await this.repoUsers.findOne({
      where: { id: id },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });
  }

  async remove(id: string) {
    await this.repoUsers.findOne({ where: { id: id } });
    this.repoUsers.softDelete({ id });
  }
}
