import express from 'express';
import axios from 'axios';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    const messages = [
      {
        role: 'system',
        content: `You are a helpful travel assistant for SmartTourist platform. You help with:
- Travel analytics and insights
- Booking management
- Destination recommendations
- Customer support
- Revenue optimization tips
- Market trends in tourism

Be concise, professional, and focus on travel-related queries.`
      },
      ...chatHistory.map(msg => ({ role: msg.isUser ? 'user' : 'assistant', content: msg.text })),
      { role: 'user', content: message }
    ];

    console.log('OPENROUTER_API_KEY present?', !!process.env.OPENROUTER_API_KEY);
    const modelToUse = process.env.OPENROUTER_MODEL || 'mistral/mistral-7b-instruct';
    console.log('Using model:', modelToUse);

    const resp = await axios.post(
      'https://api.openrouter.ai/v1/chat/completions',
      {
        model: modelToUse,
        messages,
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const botReply = resp.data?.choices?.[0]?.message?.content || resp.data?.output?.[0]?.content || 'No response from AI.';
    res.json({ success: true, provider: 'openrouter', response: botReply, messageId: Date.now() });

  } catch (error) {
    console.error('Chat error:', error.response?.data || error.message || error);
    const devErr = process.env.NODE_ENV === 'development' ? (error.response?.data || error.message) : undefined;
    res.status(500).json({ success: false, error: 'AI service failed', details: devErr });
  }
});

export default router;
