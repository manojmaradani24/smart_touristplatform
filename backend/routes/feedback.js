const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, subject, message, type, language, timestamp } = req.body;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'support@smarttourist.com',
      subject: `[SmartTourist Feedback] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Feedback from SmartTourist</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Language:</strong> ${language}</p>
            <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #374151;">Message:</h3>
            <p style="background: white; padding: 15px; border-left: 4px solid #4f46e5;">${message}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    res.status(500).json({ error: 'Failed to send feedback' });
  }
});

module.exports = router;