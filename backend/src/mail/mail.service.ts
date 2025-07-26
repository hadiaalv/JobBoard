import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Only create transporter if SMTP settings are configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      console.warn('SMTP settings not configured. Email notifications will be disabled.');
      this.transporter = null;
    }
  }

  async sendRegistrationEmail(to: string, name: string) {
    if (!this.transporter) {
      console.log('Email not sent: SMTP not configured');
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to JobBoard! 🎉</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering at JobBoard! We're excited to have you on board.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse and apply to job listings</li>
          <li>Track your application status</li>
          <li>Update your profile and resume</li>
          <li>Connect with employers</li>
        </ul>
        <p>Best regards,<br>The JobBoard Team</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Welcome to JobBoard!',
      html,
    });
  }

  async sendApplicationEmail(to: string, jobTitle: string, companyName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Received! 📝</h2>
        <p>Your application has been successfully submitted!</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Job Details:</h3>
          <p><strong>Position:</strong> ${jobTitle}</p>
          <p><strong>Company:</strong> ${companyName}</p>
        </div>
        <p>We'll notify you when the employer reviews your application.</p>
        <p>You can track your application status in your dashboard.</p>
        <p>Best regards,<br>The JobBoard Team</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Application Received - ${jobTitle}`,
      html,
    });
  }

  async sendApplicationStatusUpdateEmail(
    to: string, 
    applicantName: string, 
    jobTitle: string, 
    companyName: string, 
    status: string
  ) {
    const statusMessages = {
      'reviewed': 'Your application has been reviewed by the employer.',
      'shortlisted': 'Congratulations! You have been shortlisted for this position.',
      'hired': 'Congratulations! You have been hired for this position!',
      'rejected': 'Thank you for your interest. Unfortunately, your application was not selected for this position.'
    };

    const statusColors = {
      'reviewed': '#3b82f6',
      'shortlisted': '#8b5cf6',
      'hired': '#10b981',
      'rejected': '#ef4444'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Status Update</h2>
        <p>Hello ${applicantName},</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Job Details:</h3>
          <p><strong>Position:</strong> ${jobTitle}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Status:</strong> <span style="color: ${statusColors[status]}; font-weight: bold; text-transform: capitalize;">${status}</span></p>
        </div>
        <p>${statusMessages[status]}</p>
        <p>You can view the full details in your dashboard.</p>
        <p>Best regards,<br>The JobBoard Team</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Application Status Update - ${jobTitle}`,
      html,
    });
  }

  async sendNewApplicationNotificationEmail(
    to: string, 
    employerName: string, 
    jobTitle: string, 
    applicantName: string
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Application Received! 🎯</h2>
        <p>Hello ${employerName},</p>
        <p>You have received a new application for your job posting!</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Application Details:</h3>
          <p><strong>Position:</strong> ${jobTitle}</p>
          <p><strong>Applicant:</strong> ${applicantName}</p>
        </div>
        <p>Log in to your dashboard to review the application and take action.</p>
        <p>Best regards,<br>The JobBoard Team</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `New Application - ${jobTitle}`,
      html,
    });
  }

  async sendContactConfirmationEmail(to: string, name: string) {
    if (!this.transporter) {
      console.log('Contact confirmation email not sent: SMTP not configured');
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Message Received! 📧</h2>
        <p>Hello ${name},</p>
        <p>Thank you for contacting us! We have received your message and will get back to you as soon as possible.</p>
        <p>We typically respond within 24-48 hours during business days.</p>
        <p>If you have any urgent inquiries, please don't hesitate to reach out again.</p>
        <p>Best regards,<br>The JobBoard Team</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Message Received - JobBoard Support',
      html,
    });
  }

  async sendContactNotificationEmail(
    to: string,
    contactName: string,
    contactEmail: string,
    message: string,
    subject?: string
  ) {
    if (!this.transporter) {
      console.log('Contact notification email not sent: SMTP not configured');
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Message! 📬</h2>
        <p>A new contact message has been submitted through the website.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Message Details:</h3>
          <p><strong>From:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${contactEmail}</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p>Please respond to this message as soon as possible.</p>
        <p>Best regards,<br>JobBoard System</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `New Contact Message - ${subject || 'No Subject'}`,
      html,
    });
  }
} 