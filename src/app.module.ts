import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { configDataBase } from './database/
import { ConfigModule } from '@nestjs/config';
import { MySqlDBConfigService } from './database/orm.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: MySqlDBConfigService,
      inject: [MySqlDBConfigService],
    }),
    UsersModule,
    AuthModule,
    ClientsModule,
    SalesModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
