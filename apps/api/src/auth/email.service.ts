import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;

  async sendPasswordResetCode(to: string, code: string) {
    const from =
      process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim();

    if (!from) {
      throw new ServiceUnavailableException('Email service is not configured');
    }

    try {
      await this.getTransporter().sendMail({
        from,
        to,
        subject: 'Reset your Smart Chat System password',
        text: `Your Smart Chat System password reset code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#0f172a"><h2>Password reset</h2><p>Use this verification code to reset your password:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#2563eb">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
      });
    } catch (error) {
      console.error(
        '[auth] SMTP could not send a password reset email:',
        error instanceof Error ? error.message : 'Unknown SMTP error',
      );
      throw new ServiceUnavailableException('Unable to send reset email');
    }
  }

  private getTransporter() {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.replace(/\s/g, '');
    const port = Number(process.env.SMTP_PORT ?? 465);
    const secure =
      process.env.SMTP_SECURE === undefined
        ? port === 465
        : process.env.SMTP_SECURE.trim().toLowerCase() === 'true';

    if (!host || !user || !pass || !Number.isInteger(port)) {
      throw new ServiceUnavailableException('Email service is not configured');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      requireTLS: !secure,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });

    return this.transporter;
  }
}
