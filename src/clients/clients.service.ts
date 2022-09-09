import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ClientsEntity } from 'src/entities/client.entity';
import {
  Injectable,
  HttpStatus,
  HttpException,
  Body,
  Param,
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
    const user = await this.userService.findOne(Number(data.userId));

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
    data: ClientsEntity[];
  }> {
    const client = await this.repository.find({
      where: { userId: { id }, isActive: true },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    if (!client) {
      return {
        statusCode: HttpStatus.OK,
        message: "There're no registered customers",
        data: [],
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
    const clientField = await this.repository.findOne({ where: { id } });

    // Verifing if have any different between old and new
    const formData = {
      userId: data?.userId,
      socialReason: data?.socialReason,
      document:
        clientField?.document === data?.document
          ? clientField?.document
          : data?.document,
      phoneNumber:
        clientField?.phoneNumber === data?.phoneNumber
          ? clientField?.phoneNumber
          : data?.phoneNumber,
      address: data?.address,
      number: data?.number,
      complements: data?.complements,
      city: data?.city,
      state: data?.state,
      ...data,
    };
    await this.repository.update({ id }, formData);

    return {
      status: 200,
      message: 'Sucessfully',
    };
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
