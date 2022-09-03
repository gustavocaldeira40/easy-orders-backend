import { UpdateOrdersDto } from '../dto/orders/update-orders.dto';
import { CreateOrdersDto } from '../dto/orders/create-orders.dto';
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { OrdersData } from 'src/interfaces/datas.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateOrdersDto) {
    return this.ordersService.create(createUserDto);
  }

  @Post('/find-by-user')
  @UseGuards(JwtAuthGuard)
  findByStatus(@Body() data: OrdersData) {
    return this.ordersService.findByUser(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateOrdersDto) {
    return this.ordersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.ordersService.remove(id);
  }
}
