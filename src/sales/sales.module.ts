import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsEntity } from 'src/entities/client.entity';
import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { UsersEntity } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, ClientsEntity])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
