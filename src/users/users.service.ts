import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFieldsResponse } from 'src/interfaces/user-fields-response';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';

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
    const user = await this.repoUsers.create(data);
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
      select: [
        'id',
        'email',
        'nickname',
        'name',
        'address',
        'number',
        'complements',
        'city',
        'state',
        'country',
        'birthday',
        'isActive',
      ],
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
    const users = await this.repoUsers.findOneOrFail({
      where: { id: id },
      select: [
        'id',
        'email',
        'nickname',
        'name',
        'address',
        'number',
        'complements',
        'city',
        'state',
        'country',
        'birthday',
        'isActive',
      ],
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

  async update(id: string, data: UpdateUserDto) {
    await this.repoUsers.update({ id }, data);
    return await this.repoUsers.findOneOrFail({
      where: { id: id },
      select: [
        'id',
        'email',
        'nickname',
        'name',
        'address',
        'number',
        'complements',
        'city',
        'state',
        'country',
        'birthday',
        'isActive',
      ],
    });
  }

  async remove(id: string) {
    await this.repoUsers.findOneOrFail({ where: { id: id } });
    this.repoUsers.softDelete({ id });
  }
}
