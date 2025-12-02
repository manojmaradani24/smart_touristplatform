import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import axios from 'axios';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

const app = express();

console.log('ENV load: OPENROUTER_API_KEY present?', !!process.env.OPENROUTER_API_KEY);
console.log('ENV load: OPENAI_API_KEY present?', !!process.env.OPENAI_API_KEY);
console.log('ENV load: OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL || 'mistral/mistral-7b-instruct');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

async function callAIChat({ messages, max_tokens = 500, temperature = 0.7 }) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  const payload = {
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages,
    max_tokens,
    temperature
  };

  if (openaiKey) {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`
          },
          timeout: 30000
        }
      );
      return { provider: 'openai', data: res.data };
    } catch (err) {
      console.warn('OpenAI call failed:', err.response?.data || err.message);
      if (!openrouterKey) {
        throw err;
      }
    }
  }

  if (openrouterKey) {
    try {
      const openrouterPayload = {
        model: process.env.OPENROUTER_MODEL || 'mistral/mistral-7b-instruct',
        messages,
        max_tokens,
        temperature
      };

      const res = await axios.post(
        'https://api.openrouter.ai/v1/chat/completions',
        openrouterPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openrouterKey}`
          },
          timeout: 30000
        }
      );

      return { provider: 'openrouter', data: res.data };
    } catch (err) {
      console.error('OpenRouter call failed:', err.response?.data || err.message);
      throw err;
    }
  }

  throw new Error('No AI provider configured. Add OPENAI_API_KEY or OPENROUTER_API_KEY in .env');
}

app.post('/api/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required.' });

    const messages = [
      { role: 'system', content: 'You are a travel content specialist. Generate engaging travel-related content.' },
      { role: 'user', content: prompt }
    ];

    const ai = await callAIChat({ messages, max_tokens: 400, temperature: 0.8 });
    const text = ai.data?.choices?.[0]?.message?.content || ai.data?.output?.[0]?.content || '';
    res.json({ success: true, provider: ai.provider, text, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('❌ AI Text Generation Error:', error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: 'AI text generation failed' });
  }
});

app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required.' });

    if (process.env.OPENAI_API_KEY) {
      try {
        const ttsRes = await axios.post(
          'https://api.openai.com/v1/audio/speech',
          { model: 'gpt-4o-mini-tts', voice: process.env.TTS_VOICE || 'alloy', input: text },
          {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            responseType: 'arraybuffer',
            timeout: 30000,
          }
        );
        const audioBuffer = Buffer.from(ttsRes.data);
        res.set({ 'Content-Type': 'audio/mpeg', 'Content-Length': audioBuffer.length });
        return res.send(audioBuffer);
      } catch (err) {
        console.warn('OpenAI TTS failed, no fallback implemented:', err.response?.data || err.message);
      }
    }

    res.status(503).json({ success: false, message: 'TTS unavailable. Configure OPENAI_API_KEY.' });
  } catch (error) {
    console.error('❌ Text-to-Speech Error:', error.message || error);
    res.status(500).json({ success: false, message: 'TTS generation failed' });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
transporter.verify((err) => {
  if (err) console.error('❌ Email configuration error:', err);
  else console.log('✅ Email server is ready to send messages');
});

app.post('/api/email/feedback', async (req, res) => {
  try {
    const { name, email, subject, message, type, language } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ success: false, message: 'All fields are required' });

    const adminMailOptions = {
      from: `"SmartTourist" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `SmartTourist Feedback: ${subject}`,
      html: `<h2>New Feedback Received</h2><p><strong>Type:</strong> ${type}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong><br>${message}</p><p><strong>User:</strong> ${name} (${email})</p><p><strong>Language:</strong> ${language}</p><p><strong>Time:</strong> ${new Date().toLocaleString()}</p>`
    };

    const userMailOptions = {
      from: `"SmartTourist Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for your feedback - SmartTourist',
      html: `<h2>Hello ${name},</h2><p>We have received your feedback. Our team will review it shortly.</p><p><strong>Reference:</strong> ${subject}</p><p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p><p>Best regards,<br>SmartTourist Team</p>`
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);
    res.json({ success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({ success: false, message: 'Failed to send feedback email' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'SmartTourist API is running!', version: '1.0.0' });
});
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy', timestamp: new Date().toISOString(), uptime: process.uptime(), memory: process.memoryUsage() });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smarttourist';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}\n📡 API Base URL: http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

export default app;
