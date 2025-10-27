import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import nodemailer from 'nodemailer';
import axios from 'axios'; // 🆕 for translation API calls

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// ✅ Translation API Route (NEW)
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ success: false, message: 'Text and target language are required.' });
  }

  try {
    // Example using Google Translate API
    const response = await axios.post('https://translation.googleapis.com/language/translate/v2', null, {
      params: {
        q: text,
        target: targetLang,
        key: process.env.TRANSLATE_API_KEY, // 🔑 your API key in .env
      },
    });

    const translatedText = response.data.data.translations[0].translatedText;
    res.json({ success: true, translatedText });
  } catch (error) {
    console.error('❌ Translation API error:', error.message);
    res.status(500).json({ success: false, message: 'Translation failed' });
  }
});

// ✅ Corrected Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Must be a Gmail App Password
  }
});

// Verify email transporter on startup
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Email configuration error:', err);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Feedback email endpoint
app.post('/api/email/feedback', async (req, res) => {
  try {
    const { name, email, subject, message, type, language } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email to admin
    const adminMailOptions = {
      from: `"SmartTourist" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `SmartTourist Feedback: ${subject}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <p><strong>User:</strong> ${name} (${email})</p>
        <p><strong>Language:</strong> ${language}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: `"SmartTourist Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for your feedback - SmartTourist',
      html: `
        <h2>Hello ${name},</h2>
        <p>We have received your feedback. Our team will review it shortly.</p>
        <p><strong>Reference:</strong> ${subject}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        <p>Best regards,<br>SmartTourist Team</p>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({ success: false, message: 'Failed to send feedback email' });
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartmerchant';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'SmartMerchant API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});
