import { UsersService } from 'src/users/users.service';
import { UpdateOrdersDto } from '../dto/orders/update-orders.dto';
import { CreateOrdersDto } from '../dto/orders/create-orders.dto';
import { OrdersEntity } from './../entities/orders.entity';
import {
  Injectable,
  Body,
  Param,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseOrdersData } from 'src/interfaces/response-orders.interface';
import { OrdersData } from 'src/interfaces/datas.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private repository: Repository<OrdersEntity>,

    private userService: UsersService,
  ) {}

  async create(@Body() data: CreateOrdersDto): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: ResponseOrdersData;
  }> {
    // Verify if user don't is inactive
    const user = await this.userService.findOne(Number(data.userId));

    if (user.data === null) {
      throw new HttpException('User Not Avaliable !', HttpStatus.NOT_FOUND);
    }

    if (!data.status) {
      data.status = 'Waiting';
    }

    const order = this.repository.create(data);
    const saveOrder: ResponseOrdersData = await this.repository.save(order);

    const { id, product, salesValue, status, isActive } = saveOrder;

    return {
      statusCode: HttpStatus.OK,
      message: 'Order created successfully',
      data: { id, product, salesValue, status, isActive },
    };
  }

  async findAll(): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: OrdersEntity[];
  }> {
    const orders = await this.repository.find({
      where: { isActive: true },
      order: { product: 'ASC' },
      relations: { userId: true, clientId: true },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  async findByUser(@Body() data: OrdersData): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: OrdersEntity[];
  }> {
    const orders = await this.repository.find({
      relations: { clientId: true },
      where: {
        status: data.status,
        userId: { id: data?.userId },
        clientId: { id: data?.clientId },
        isActive: true,
      },
      order: { product: 'DESC' },
      take: 10,
    });

    if (!orders) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Orders fetched successfully',
        data: [],
      };
    }

    if (orders) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Orders fetched successfully',
        data: orders,
      };
    }
  }

  async findOne(@Param('id') id: number): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: OrdersEntity;
  }> {
    const order = await this.repository.findOne({
      where: { id: id, isActive: true },
    });

    if (!order) {
      throw new HttpException('Order not found !', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Order fetched successfully',
      data: order,
    };
  }

  async update(id: number, data: UpdateOrdersDto) {
    const order = await this.repository.update({ id }, data);

    if (!order) {
      throw new NotFoundException('Order Not Found !');
    }
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async remove(id: number) {
    const order = await this.repository.findOne({ where: { id: id } });
    if (!order) {
      throw new HttpException('Order Not Found !', HttpStatus.NOT_FOUND);
    }

    order.isActive = false;

    await this.repository.save(order);
    return 'Sucessfully';
  }
}
