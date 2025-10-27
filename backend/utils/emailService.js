import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - SmartMerchant',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white; }
                .otp-code { font-size: 32px; font-weight: bold; text-align: center; color: #667eea; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; letter-spacing: 5px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SmartMerchant</h1>
                    <p>Your Business Companion</p>
                </div>
                <h2>Password Reset Request</h2>
                <p>Hello ${name},</p>
                <p>You have requested to reset your password. Use the OTP code below to verify your identity:</p>
                <div class="otp-code">${otp}</div>
                <p>This OTP is valid for <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>SmartMerchant Team</p>
                <div class="footer">
                    <p>© 2024 SmartMerchant. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send password reset confirmation
export const sendPasswordResetConfirmation = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful - SmartMerchant',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white; }
                .success-icon { text-align: center; font-size: 48px; color: #10b981; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SmartMerchant</h1>
                    <p>Your Business Companion</p>
                </div>
                <div class="success-icon">✓</div>
                <h2>Password Reset Successful</h2>
                <p>Hello ${name},</p>
                <p>Your password has been successfully reset. If you did not make this change, please contact our support team immediately.</p>
                <p>You can now login with your new password.</p>
                <p>Best regards,<br>SmartMerchant Team</p>
                <div class="footer">
                    <p>© 2024 SmartMerchant. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};