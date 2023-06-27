import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendActivationMail(email: string, link: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Активация аккаунта на ${process.env.CLIENT_URL}`,
      text: '',
      html: `
			<div>
				<h1>Активация аккаунта ${email} на ${process.env.CLIENT_URL}</h1>
				<a href="${link}">${link}</a>
			</div>
		`,
    });
  }
}
