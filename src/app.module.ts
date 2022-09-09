import { AppController } from './app.controller';
import { OrdersModule } from './orders/orders.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MySqlDBConfigService } from './database/orm.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: MySqlDBConfigService,
      inject: [MySqlDBConfigService],
    }),
    UsersModule,
    AuthModule,
    ClientsModule,
    OrdersModule,
    FilesModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
