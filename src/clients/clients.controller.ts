import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateClientsDto } from 'src/dto/clients/create-clients.dto';
import { UpdateClientDto } from 'src/dto/clients/update-clients.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateClientsDto) {
    return this.clientsService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.clientsService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateClientDto) {
    return this.clientsService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.clientsService.remove(id);
  }
}
