import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ClientsEntity } from 'src/entities/client.entity';
import {
  Injectable,
  HttpStatus,
  HttpException,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientsDto } from 'src/dto/clients/create-clients.dto';
import { UpdateClientDto } from 'src/dto/clients/update-clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsEntity)
    private repository: Repository<ClientsEntity>,

    private userService: UsersService,
  ) {}

  async create(@Body() data: CreateClientsDto): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: ClientsEntity;
  }> {
    // Verify if user don't is inactive
    const user = await this.userService.findOne(data.userId);

    if (user.data === null) {
      throw new HttpException('User Not Avaliable !', HttpStatus.NOT_FOUND);
    }

    const reponse = await this.repository.findOne({
      where: { document: data.document, isActive: true },
    });

    if (reponse) {
      throw new HttpException(
        'Client with this document already exist !',
        HttpStatus.CONFLICT,
      );
    }

    const client = await this.repository.create(data);

    const saveClient = await this.repository.save(client);

    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      data: saveClient,
    };
  }

  async findAll(): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: ClientsEntity[];
  }> {
    const clients = await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Clients fetched successfully',
      data: clients,
    };
  }

  async findByUser(@Param('id') id: number): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: ClientsEntity;
  }> {
    const client = await this.repository.findOne({
      where: { user: { id: id } },
    });

    if (!client) {
      return {
        statusCode: HttpStatus.OK,
        message: "There're no registered customers",
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Client fetched successfully',
      data: client,
    };
  }

  async findOne(@Param('id') id: number): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: ClientsEntity;
  }> {
    const client = await this.repository.findOne({
      where: { id: id, isActive: true },
      order: { createdAt: 'ASC' },
    });

    if (!client) {
      return {
        statusCode: HttpStatus.OK,
        message: "There're no registered customers",
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Client fetched successfully',
      data: client,
    };
  }

  async update(id: number, data: UpdateClientDto) {
    const client = await this.repository.update({ id }, data);

    if (!client) {
      throw new NotFoundException();
    }

    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async remove(id: number) {
    const client = await this.repository.findOne({ where: { id: id } });
    if (!client) {
      throw new HttpException('Client Not Found !', HttpStatus.NOT_FOUND);
    }

    client.isActive = false;

    await this.repository.save(client);
    return 'Sucessfully';
  }
}
