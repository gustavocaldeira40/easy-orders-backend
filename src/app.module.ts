import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { configDataBase } from './database/
import { ConfigModule } from '@nestjs/config';
import { MySqlDBConfigService } from './database/orm.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: MySqlDBConfigService,
      inject: [MySqlDBConfigService],
    }),
    UsersModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
