import { ClientsEntity } from 'src/entities/client.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientsEntity]), UsersModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
