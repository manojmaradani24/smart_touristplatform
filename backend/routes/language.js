const express = require('express');
const router = express.Router();

// Get available languages
router.get('/languages', (req, res) => {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' }
  ];
  res.json(languages);
});

// Change user language preference
router.post('/change-language', (req, res) => {
  const { language } = req.body;
  
  // Validate language
  const supportedLanguages = ['en', 'hi', 'es', 'fr', 'de'];
  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Unsupported language' 
    });
  }

  // Here you would typically save to user profile in database
  // For now, we'll just return success
  res.json({ 
    success: true, 
    message: `Language changed to ${language}`,
    language 
  });
});

module.exports = router;