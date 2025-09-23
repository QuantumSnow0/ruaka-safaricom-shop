// Email templates for Lipamdogomdogo
export const emailTemplates = {
  confirmSignup: (confirmationUrl: string, userEmail: string) => ({
    subject: "Welcome to Lipamdogomdogo - Confirm Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Lipamdogomdogo</h1>
          <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 16px;">Your Trusted Mobile Store</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px; background: #f8f9fa;">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Welcome to Lipamdogomdogo!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
            Hi there! 👋
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
            Thank you for signing up with Lipamdogomdogo! We're excited to have you join our community of mobile phone enthusiasts.
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
            To complete your registration and start shopping, please confirm your email address by clicking the button below:
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${confirmationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
              Confirm Email Address
            </a>
          </div>
          
          <!-- Features -->
          <div style="background: white; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">What you can do with your account:</h3>
            <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Browse our latest mobile phones and accessories</li>
              <li>Add items to your wishlist</li>
              <li>Track your orders in real-time</li>
              <li>Get exclusive deals and offers</li>
              <li>Contact us directly via WhatsApp</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
            If you didn't create an account with us, please ignore this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #1f2937; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">© 2024 Lipamdogomdogo</p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">Your trusted mobile store in Kenya</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
            📱 Best Prices | 🚚 Fast Delivery | 💬 WhatsApp Support
          </p>
        </div>
      </div>
    `,
    text: `
Welcome to Lipamdogomdogo!

Thank you for signing up! Please confirm your email address to complete your registration.

Click here to confirm: ${confirmationUrl}

What you can do with your account:
- Browse our latest mobile phones and accessories
- Add items to your wishlist
- Track your orders in real-time
- Get exclusive deals and offers
- Contact us directly via WhatsApp

If you didn't create an account with us, please ignore this email.

© 2024 Lipamdogomdogo - Your trusted mobile store in Kenya
    `.trim(),
  }),

  resetPassword: (resetUrl: string, userEmail: string) => ({
    subject: "Reset Your Lipamdogomdogo Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Lipamdogomdogo</h1>
          <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 16px;">Your Trusted Mobile Store</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px; background: #f8f9fa;">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Reset Your Password</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
            Hi there! 👋
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
            We received a request to reset your password for your Lipamdogomdogo account.
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
            Click the button below to reset your password:
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
              Reset Password
            </a>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: bold;">⚠️ Security Notice</p>
            <p style="color: #92400e; margin: 8px 0 0 0; font-size: 14px;">
              This link will expire in 24 hours for your security. If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
            If you're having trouble with the button above, copy and paste this URL into your browser: ${resetUrl}
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #1f2937; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">© 2024 Lipamdogomdogo</p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">Your trusted mobile store in Kenya</p>
        </div>
      </div>
    `,
    text: `
Reset Your Lipamdogomdogo Password

We received a request to reset your password for your Lipamdogomdogo account.

Click here to reset: ${resetUrl}

This link will expire in 24 hours for your security. If you didn't request this password reset, please ignore this email.

© 2024 Lipamdogomdogo - Your trusted mobile store in Kenya
    `.trim(),
  }),
};

export default emailTemplates;

