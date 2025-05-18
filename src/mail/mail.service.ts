import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: `Onboarding Team <support@test.com>`,
      subject: `Welcome to the Team ${user.email}`,
      template: join(__dirname, 'templates', 'welcome'),
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:3000/login',
      },
    });
  }
}
