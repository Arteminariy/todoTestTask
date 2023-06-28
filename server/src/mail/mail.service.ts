import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async sendActivationMail(email: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Активация аккаунта на ${this.configService.get('CLIENT_URL')}`,
      text: '',
      html: `
				<div>
					<h1>Ссылка для активации аккаунта на ${this.configService.get(
            'CLIENT_URL',
          )}</h1>
					<a href="${link}">${link}</a>
				</div>
			`,
    });
  }
}
