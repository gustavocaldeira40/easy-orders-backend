import { OrdersEntity } from '../entities/orders.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ClientsEntity } from 'src/entities/client.entity';
import { UsersEntity } from 'src/entities/user.entity';
import { FilesEntity } from 'src/entities/files.entity';
import { TokensEntity } from 'src/entities/token.entity';

@Injectable()
export class MySqlDBConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: this.configService.get<number>('DB_PORT'),
      database: this.configService.get<string>('DB_NAME'),
      synchronize: true,
      entities: [
        UsersEntity,
        ClientsEntity,
        OrdersEntity,
        FilesEntity,
        TokensEntity,
      ],
      // entities: [__dirname + '/../entities/*.ts'],
      logging: false,
    };
  }
}
