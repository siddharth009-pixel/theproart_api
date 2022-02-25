import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Transporter } from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailServiceService {
  private readonly mailTransporter: Transporter<SMTPTransport.SentMessageInfo> =
    createTransport({
      service: 'gmail', // hostname
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "micwilson13892@gmail.com",
        pass: "mEhul@#123..",
      },
    });

  async sendMail(
    mailId: string,
    mailSubject: string,
    mailHTML: string,
  ): Promise<SMTPTransport.SentMessageInfo> {
    return this.mailTransporter.sendMail({
      from: 'micwilson13892@gmail.com',
      to: mailId,
      subject: mailSubject,
      html: mailHTML,
    });
  }
}
