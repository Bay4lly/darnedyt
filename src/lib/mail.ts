import nodemailer from 'nodemailer';
import { db } from './db';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '587');
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASSWORD;
const mailFrom = process.env.MAIL_FROM || 'DarNed Sponsorship Hub <umran3639828@gmail.com>';
const adminNotifyEmail = process.env.ADMIN_EMAIL_NOTIFY || 'umran3639828@gmail.com';

const transporter = nodemailer.createTransport(
  (smtpHost && smtpUser
    ? {
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }
    : {
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      }) as any
);

export async function sendEmail({
  to,
  subject,
  html,
  text,
  ticketId,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  ticketId?: string;
}): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: mailFrom,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''),
    });

    console.log(`✉️ Email sent to ${to}: ${subject}`);

    await db.emailLog.create({
      data: {
        recipient: to,
        subject,
        body: html.slice(0, 1000),
        status: 'SUCCESS',
        ticketId,
      },
    });

    return true;
  } catch (error: any) {
    console.error('❌ Email dispatch failed:', error);

    await db.emailLog.create({
      data: {
        recipient: to,
        subject,
        body: html.slice(0, 1000),
        status: 'FAILED',
        error: error?.message || 'Unknown SMTP error',
        ticketId,
      },
    });

    return false;
  }
}

// Brand Email Wrapper Template
function wrapEmailTemplate(content: string, headerTitle: string = 'DarNed Sponsorship Hub') {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${headerTitle}</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #07070a; color: #f8fafc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background-color: #0f0f17; border: 1px solid #7c3aed40; border-radius: 16px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 30px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
      .body { padding: 30px; line-height: 1.6; color: #cbd5e1; }
      .footer { background-color: #07070a; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
      .btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #7c3aed, #ec4899); color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 8px; margin: 20px 0; }
      .ticket-badge { background-color: #1e1b4b; border: 1px solid #6366f1; color: #a5b4fc; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${headerTitle}</h1>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>DarNed Official Sponsorship Platform | @DarNedYt (385k+ Subscribers)</p>
        <p>Contact: ${adminNotifyEmail}</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const content = `
    <h2>Welcome to DarNed Hub, ${name}! 🎉</h2>
    <p>Thank you for creating an account on the official DarNed Sponsorship & Collaboration platform.</p>
    <p>You can now manage sponsorship inquiries, track submitted tickets, and communicate directly with DarNed's team.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="btn">Log In to Your Account</a>
  `;
  return sendEmail({ to, subject: 'Welcome to DarNed Sponsorship Hub', html: wrapEmailTemplate(content, 'Welcome!') });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const content = `
    <h2>Password Reset Request 🔐</h2>
    <p>We received a request to reset your password. Click the button below to set a new password. This link is valid for 1 hour.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p><small>If you did not request this, please ignore this email.</small></p>
  `;
  return sendEmail({ to, subject: 'Password Reset Request - DarNed Hub', html: wrapEmailTemplate(content, 'Reset Password') });
}

export async function sendTicketConfirmationEmail(to: string, name: string, ticketNumber: string, subject: string) {
  const ticketUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/tickets/${ticketNumber}`;
  const content = `
    <h2>Inquiry Received! 🚀</h2>
    <p>Hello ${name},</p>
    <p>Thank you for reaching out! We have received your inquiry <span class="ticket-badge">${ticketNumber}</span> regarding <strong>${subject}</strong>.</p>
    <p>Our team reviews all incoming inquiries promptly and will get back to you within 24-48 business hours.</p>
    <a href="${ticketUrl}" class="btn">View Ticket Status</a>
  `;
  return sendEmail({ to, subject: `[${ticketNumber}] Inquiry Received - ${subject}`, html: wrapEmailTemplate(content, 'Inquiry Received'), ticketId: ticketNumber });
}

export async function sendAdminNewTicketAlert(ticketNumber: string, clientName: string, clientEmail: string, subject: string, category: string) {
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/tickets`;
  const content = `
    <h2>New Sponsorship Inquiry Received! 🔔</h2>
    <p>A new ticket has been submitted to the hub.</p>
    <ul>
      <li><strong>Ticket #:</strong> <span class="ticket-badge">${ticketNumber}</span></li>
      <li><strong>Client:</strong> ${clientName} (${clientEmail})</li>
      <li><strong>Category:</strong> ${category}</li>
      <li><strong>Subject:</strong> ${subject}</li>
    </ul>
    <a href="${adminUrl}" class="btn">Open Admin Dashboard</a>
  `;
  return sendEmail({ to: adminNotifyEmail, subject: `[NEW TICKET] ${ticketNumber} - ${clientName}`, html: wrapEmailTemplate(content, 'Admin Alert') });
}

export async function sendTicketReplyNotification(to: string, name: string, ticketNumber: string, messagePreview: string) {
  const ticketUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/tickets/${ticketNumber}`;
  const content = `
    <h2>New Reply on Ticket ${ticketNumber} 💬</h2>
    <p>Hello ${name},</p>
    <p>The DarNed team has replied to your ticket <span class="ticket-badge">${ticketNumber}</span>:</p>
    <blockquote style="background: #1a1a2e; padding: 15px; border-left: 4px solid #7c3aed; margin: 15px 0; font-style: italic;">
      "${messagePreview}"
    </blockquote>
    <a href="${ticketUrl}" class="btn">View & Reply to Ticket</a>
  `;
  return sendEmail({ to, subject: `[${ticketNumber}] New Reply from DarNed Team`, html: wrapEmailTemplate(content, 'Ticket Update'), ticketId: ticketNumber });
}
