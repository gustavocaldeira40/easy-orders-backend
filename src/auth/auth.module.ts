import { TokensEntity } from 'src/entities/token.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './guards/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { CodeVerificationEntity } from 'src/entities/code-verification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      TokensEntity,
      CodeVerificationEntity,
    ]),
    MailModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
