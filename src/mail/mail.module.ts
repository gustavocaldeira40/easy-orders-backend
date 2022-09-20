import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { CodeVerificationEntity } from 'src/entities/code-verification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/user.entity';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          tls: {
            ciphers: 'SSLv3',
          },
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"easy-orders" ${config.get<string>('MAIL_FROM')}`,
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    TypeOrmModule.forFeature([CodeVerificationEntity, UsersEntity]),
  ],

  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
