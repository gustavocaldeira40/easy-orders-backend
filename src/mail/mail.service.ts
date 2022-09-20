import { UsersEntity } from 'src/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeVerificationEntity } from 'src/entities/code-verification.entity';
import { ForgotPasswordData } from 'src/interfaces/forgot-password.interface';
import { Repository } from 'typeorm';
@Injectable()
export class MailService {
  constructor(
    @InjectRepository(CodeVerificationEntity)
    private repository: Repository<CodeVerificationEntity>,

    private mailerService: MailerService,
  ) {}

  async sendUserPasswordReset(user: ForgotPasswordData) {
    // Generate Code of 6 digits
    const code = Math.floor(Math.random() * 655366);

    // Verify if already exists a code
    const codeUser = await this.repository.findOne({
      where: { userId: { id: user?.id }, isActive: true },
    });

    // Save the new code
    if (!codeUser) {
      await this.repository.save({
        code: code,
        userId: { id: user.id },
      });
    }

    // update the code
    if (codeUser) {
      await this.repository.update({ id: codeUser?.id }, { code: code });
    }

    // Send Email
    const mail = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Redefinição de senha',
      template: 'forgot-password-code',
      context: {
        code,
      },
    });

    if (mail) {
      return true;
    } else {
      return false;
    }
  }
}
