import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseUsersData } from 'src/interfaces/response-users.interface';
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
    private repository: Repository<UsersEntity>,
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
    const { id, ...allFields } = saveUser;

    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      data: { id, ...allFields },
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
      relations: { clients: true, orders: true },
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
    const user = await this.repository.findOne({
      where: { id: id, isActive: true },
      order: {
        name: 'ASC',
      },
      select: userQuery as FindOptionsSelect<UsersEntity>,
    });

    if (!user) {
      throw new HttpException('User not found !', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: user,
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
