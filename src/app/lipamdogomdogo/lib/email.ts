import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || "noreply@lipamdogomdogo.com",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to Lipamdogomdogo!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1E3A8A;">Welcome to Lipamdogomdogo!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Lipamdogomdogo! We're excited to help you find the perfect phone with flexible payment options.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse our latest smartphone collection</li>
          <li>Choose flexible installment payment plans</li>
          <li>Track your orders and payments</li>
          <li>Manage your profile and preferences</li>
        </ul>
        <p>Happy shopping!</p>
        <p>Best regards,<br>The Lipamdogomdogo Team</p>
      </div>
    `,
  }),

  orderConfirmation: (
    orderNumber: string,
    customerName: string,
    total: number
  ) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1E3A8A;">Order Confirmation</h1>
        <p>Hi ${customerName},</p>
        <p>Thank you for your order! We've received your payment and are processing your order.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> KES ${total.toLocaleString()}</p>
          <p><strong>Status:</strong> Processing</p>
        </div>
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>The Lipamdogomdogo Team</p>
      </div>
    `,
  }),

  orderShipped: (
    orderNumber: string,
    customerName: string,
    trackingNumber?: string
  ) => ({
    subject: `Your Order Has Shipped - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1E3A8A;">Your Order Has Shipped!</h1>
        <p>Hi ${customerName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipping Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          ${
            trackingNumber
              ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>`
              : ""
          }
          <p><strong>Status:</strong> Shipped</p>
        </div>
        <p>You should receive your order within 2-3 business days.</p>
        <p>Best regards,<br>The Lipamdogomdogo Team</p>
      </div>
    `,
  }),

  paymentReminder: (customerName: string, amount: number, dueDate: string) => ({
    subject: "Payment Reminder - Lipamdogomdogo",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1E3A8A;">Payment Reminder</h1>
        <p>Hi ${customerName},</p>
        <p>This is a friendly reminder that your next installment payment is due soon.</p>
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3>Payment Details:</h3>
          <p><strong>Amount Due:</strong> KES ${amount.toLocaleString()}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Please make your payment to avoid any late fees.</p>
        <p>Best regards,<br>The Lipamdogomdogo Team</p>
      </div>
    `,
  }),
};
