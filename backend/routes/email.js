import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const { name, email, subject, message, type, language } = req.body;

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'manojmaradani24@gmail.com',
      subject: `SmartTourist Feedback: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
            .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .value { color: #555; }
            .type-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; }
            .bug { background: #dc3545; }
            .feature { background: #28a745; }
            .general { background: #007bff; }
            .support { background: #ffc107; color: #000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 New Feedback Received</h1>
              <p>SmartTourist Platform</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Feedback Type</div>
                <div class="value">
                  <span class="type-badge ${type}">${type.toUpperCase()}</span>
                </div>
              </div>
              
              <div class="field">
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="label">Message</div>
                <div class="value" style="white-space: pre-line;">${message}</div>
              </div>
              
              <div class="field">
                <div class="label">User Details</div>
                <div class="value">
                  <strong>Name:</strong> ${name}<br>
                  <strong>Email:</strong> ${email}<br>
                  <strong>Language:</strong> ${language}
                </div>
              </div>
              
              <div class="field">
                <div class="label">Timestamp</div>
                <div class="value">${new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your feedback - SmartTourist',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .thank-you { text-align: center; margin-bottom: 30px; }
            .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Thank You for Your Feedback!</h1>
              <p>We appreciate you taking the time to help us improve</p>
            </div>
            <div class="content">
              <div class="thank-you">
                <h2>Hello ${name},</h2>
                <p>We've received your feedback and truly value your input. Our team will review your message and get back to you if needed.</p>
              </div>
              
              <div class="next-steps">
                <h3>What happens next?</h3>
                <ul>
                  <li>Our team reviews all feedback daily</li>
                  <li>For bug reports, we'll work on fixes in our next update</li>
                  <li>For feature requests, we'll consider them for our roadmap</li>
                  <li>For support issues, we'll contact you within 24 hours</li>
                </ul>
              </div>
              
              <p><strong>Reference:</strong> ${subject}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                Best regards,<br>
                <strong>The SmartTourist Team</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({
      success: true,
      message: 'Feedback sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send feedback email'
    });
  }
});

export default router;
