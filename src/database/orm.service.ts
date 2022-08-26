import { ClientsAddressEntity } from './../entities/client-address.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ClientsEntity } from 'src/entities/client.entity';
import { SalesEntity } from 'src/entities/sale.entity';
import { UsersEntity } from 'src/entities/user.entity';
import { UsersAddressEntity } from 'src/entities/user-address';

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
        UsersAddressEntity,
        ClientsEntity,
        ClientsAddressEntity,
        SalesEntity,
      ],
      // entities: [__dirname + '/../entities/*.ts'],
      logging: false,
    };
  }
}
