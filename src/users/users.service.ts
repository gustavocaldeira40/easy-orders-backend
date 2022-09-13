/* eslint-disable prettier/prettier */
import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseUsersData } from 'src/interfaces/response-users.interface';
import { FindOptionsSelect, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { userQuery } from 'src/query/users.query';
import { UsersEntity } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';

import { cpf, cnpj } from 'cpf-cnpj-validator';
import { FilesEntity } from 'src/entities/files.entity';
import { ChangePasswordData } from 'src/interfaces/change-password.interface';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private repository: Repository<UsersEntity>,

    @InjectRepository(FilesEntity)
    private files: Repository<FilesEntity>,
  ) {}

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

  async findAll(): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: UsersEntity[];
  }> {
    const users = await this.repository.find({
      where: { isActive: true },
      order: { lastLoginAt: 'ASC' },
      relations: { clients: true, orders: true, avatar: true },
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
    data: { avatar: FilesEntity };
  }> {
    const user = await this.repository.findOne({
      where: { id: id, isActive: true },
      order: {
        name: 'DESC',
      },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });

    // Get Avatar
    const file = await this.files.findOne({
      where: { userId: id, isActive: true },
      order: { createdAt: 'DESC' },
      select: ['fileName', 'typeFile'],
    });

    if (!user) {
      throw new HttpException('User not found !', HttpStatus.NOT_FOUND);
    }

    // Concat avatar with user data
    const data = { avatar: file ? file : null, ...user };

    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: data,
    };
  }

  async changePassword(id: number, data: ChangePasswordData) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException("User Don't Exist", HttpStatus.CONFLICT);
    }

    const validPassword = await bcrypt.compare(data.oldPassword, user.password);

    if (!(await validPassword)) {
      throw new UnauthorizedException();
    }

    user.password = await bcrypt.hash(data?.password, saltOrRounds);

    const save = await this.repository.save(user);
    // Seleciona para retorno somente dos campos determinados e necessarios
    const {
      name,
      email,
      nickname,
      address,
      number,
      complements,
      city,
      state,
      clients,
      orders,
      isActive,
    } = save;

    return {
      statusCode: HttpStatus.OK,
      message: 'Password upgrade with sucessfuly !',
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
        clients,
        orders,
        isActive,
      },
    };
  }

  async findUserByEmail(email: string): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: UsersEntity;
  }> {
    try {
      const user = await this.repository.findOne({
        where: { email, isActive: true },
        order: {
          lastLoginAt: 'ASC',
        },
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
    const user = await this.repository.findOne({
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
    const { document } = data;

    if (document?.length !== undefined) {
      if (document?.length === 11) {
        console.log('IS VALI inside', cpf.isValid(document));
        const isValid = cpf.isValid(document);
        if (!isValid) {
          throw new NotFoundException();
        }
      }

      if (document?.length === 14) {
        console.log('É IGUAL A 14', cnpj.isValid(document));
        const isValid = cnpj.isValid(document);
        if (!isValid) {
          throw new NotFoundException();
        }
      }
    }
    const user = await this.repository.update({ id }, data);

    if (!user) {
      throw new NotFoundException();
    }
    return await this.repository.findOne({
      where: { id: id },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });
  }

  async remove(id: number) {
    const user = await this.repository.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException('User Not Found !', HttpStatus.NOT_FOUND);
    }

    user.isActive = false;

    await this.repository.save(user);
    return 'Sucessfully';
  }
}
