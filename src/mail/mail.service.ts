import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ForgotPasswordData } from 'src/interfaces/forgot-password.interface';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserPasswordReset(user: ForgotPasswordData) {
    // Generate Code of 6 digits
    const code = Math.floor(Math.random() * 655366);
    const mail = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Redefinição de senha',
      template: 'forgot-password-code',
      context: {
        name: user?.name,
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
