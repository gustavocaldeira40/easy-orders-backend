import { UsersModule } from 'src/users/users.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersEntity } from './../entities/orders.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity]), UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
