import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(
    to: string,
    tempPassword: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || "Drizmo <noreply@drizmo.com>",
        to: to,
        subject: "Password Reset - Drizmo",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Drizmo
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #1e293b;">Password Reset Request</h2>
                  <p style="margin: 0 0 24px 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                    We received a request to reset your password. Here's your temporary password:
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 20px 40px;">
                  <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 24px; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #0369a1; font-weight: 600;">Your Temporary Password:</p>
                    <p style="margin: 0; font-size: 28px; font-family: 'Courier New', monospace; font-weight: 700; color: #0369a1; letter-spacing: 4px; background: #ffffff; padding: 16px; border-radius: 8px; border: 2px dashed #0ea5e9;">
                      ${tempPassword}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      <strong>⚠️ Important:</strong> Please change your password immediately after logging in.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                    If you didn't request this password reset, please ignore this email or contact support.
                  </p>
                  <p style="margin: 16px 0 0 0; font-size: 12px; color: #94a3b8;">
                    © ${new Date().getFullYear()} Drizmo. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        text: `
          Password Reset - Drizmo
          
          We received a request to reset your password.
          
          Your temporary password: ${tempPassword}
          
          Please change your password immediately after logging in.
          
          If you didn't request this password reset, please ignore this email.
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }
}

