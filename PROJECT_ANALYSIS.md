# SmartMerchant SaaS - Project Analysis

## 📋 Project Overview

**Project Name:** SmartMerchant SaaS (Smart Tourist Platform)  
**Repository:** smart_touristplatform (Branch: main)  
**Owner:** manojmaradani24  
**Architecture:** Full-stack SaaS application with separate backend and frontend

---

## 🏗️ Project Structure

```
SmartMerchant-saas-main/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── email.js
│   │   ├── feedback.js
│   │   └── language.js
│   └── utils/
│       └── emailService.js
│
└── SmartMerchant-saas-main/ (Frontend)
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── eslint.config.js
    ├── tsconfig.json
    └── .bolt/
        └── config.json
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js with ES Modules
- **Framework:** Express.js (v4.21.2)
- **Database:** MongoDB with Mongoose (v8.20.1)
- **Authentication:** JWT (JSON Web Tokens)
- **Email Service:** Nodemailer (v7.0.10)
- **Security:** bcryptjs (password hashing)
- **API Integration:** Axios
- **Validation:** express-validator
- **AI Integration:** OpenAI (v4.104.0) + OpenRouter API fallback
- **Development Tool:** Nodemon

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.5.3
- **Build Tool:** Vite 7.1.6
- **Styling:** Tailwind CSS 3.4.1
- **State Management:** None (component-level state)
- **Routing:** React Router DOM (v7.9.1)
- **Drag & Drop:** React DnD
- **Charting:** Recharts (v3.5.0)
- **UI Components:** 
  - Radix UI (Dialog, Scroll Area)
  - Headless UI
  - Heroicons
  - Lucide React
- **AI Integration:** Vercel AI SDK (@ai-sdk/openai)
- **Internationalization:** i18next + react-i18next
- **Toast Notifications:** React Hot Toast
- **Backend Integration:** Supabase (v2.57.4)
- **Animations:** Framer Motion (v12.23.24)
- **Icons:** React Icons, Font Awesome

---

## 🎯 Key Features

### 1. **Authentication System**
- User registration with email and password
- Login functionality
- JWT token-based session management
- Password reset with OTP verification
- OTP generation and validation
- Predefined demo users (5 users for testing)
- User types: Regular and Predefined
- Business type categorization: MSME, Developer, Worker, Student

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - OTP request
- `POST /api/auth/verify-otp` - OTP validation
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/verify` - Token verification

### 2. **AI Chat Integration**
- Intelligent travel assistant chatbot
- Support for multiple AI providers:
  - **Primary:** OpenAI (GPT-3.5-turbo)
  - **Fallback:** OpenRouter (Mistral 7B)
- Chat history management
- Specialized prompts for travel domain
- Error handling with provider fallback

**Endpoints:**
- `POST /api/chat` - Send chat message

### 3. **Email Services**
- OTP email delivery
- Password reset confirmations
- Feedback/support emails
- HTML-formatted email templates
- Gmail integration via Nodemailer

**Endpoints:**
- `POST /api/email/feedback` - Submit feedback

### 4. **AI-Powered Content Generation**
- Text generation for travel content
- Text-to-Speech synthesis
- Multi-provider support

**Endpoints:**
- `POST /api/generate-text` - Generate travel content
- `POST /api/text-to-speech` - Convert text to audio

### 5. **System Endpoints**
- Health check endpoint
- API status verification

**Endpoints:**
- `GET /` - API root
- `GET /api/health` - Server health status

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required for regular users),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed with bcrypt),
  userType: String (enum: 'regular', 'predefined'),
  businessType: String (enum: 'msme', 'developer', 'worker', 'student'),
  isVerified: Boolean (default: false),
  createdAt: Date (default: now)
}
```

**Additional User Methods:**
- `comparePassword()` - Password verification
- `generateOTP()` - OTP generation
- `isOTPValid()` - OTP validation
- `clearOTP()` - Clear OTP after use

---

## 🔐 Security Features

1. **Password Security**
   - Bcrypt with 12-salt rounds
   - Minimum 6 characters
   - Pre-save hashing with Mongoose middleware

2. **Authentication**
   - JWT tokens with 24-hour expiration
   - Bearer token validation
   - Protected routes with auth middleware

3. **Email Validation**
   - express-validator for input validation
   - Email format verification
   - OTP validation with expiration

4. **CORS**
   - Enabled for cross-origin requests

---

## 🚀 Environment Configuration

### Required Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/smarttourist
PORT=5000
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-3.5-turbo
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=mistral/mistral-7b-instruct
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
TTS_VOICE=alloy
NODE_ENV=development
```

---

## 📦 Backend Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `nodemailer` - Email service
- `axios` - HTTP client
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- `express-validator` - Input validation
- `openai` - OpenAI API client

### Development Dependencies
- `nodemon` - Auto-reload server

---

## 📦 Frontend Dependencies

### Core Libraries
- `react` - UI framework
- `react-router-dom` - Routing
- `typescript` - Type safety
- `vite` - Build tool

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `react-icons` - Additional icons
- `@heroicons/react` - Hero icons
- `framer-motion` - Animations

### Features
- `react-dnd` - Drag and drop
- `recharts` - Data visualization
- `react-hot-toast` - Notifications
- `react-intl` - Internationalization
- `i18next` - Multi-language support

### Backend Integration
- `@supabase/supabase-js` - Backend as a service
- `@ai-sdk/openai` - AI SDK
- `ai` - Vercel AI library

---

## 🧪 Predefined Demo Users

| Email | Password | Name | User Type | Business Type |
|-------|----------|------|-----------|---------------|
| manoj@gmail.com | manoj123 | Manoj Kumar | Predefined | MSME |
| geetha@gmail.com | geetha123 | Geetha Sharma | Predefined | MSME |
| surya@gmail.com | surya123 | Surya Patel | Predefined | MSME |
| josh@gmail.com | josh123 | Josh Mathew | Predefined | MSME |
| nandini@gmail.com | nandini123 | Nandini Reddy | Predefined | MSME |

---

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## 📝 Running the Application

### Backend
```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

---

## 🎨 Frontend Configuration

### Build Configuration (Vite)
- React plugin enabled
- Lucide-react excluded from optimization

### Styling
- Tailwind CSS configured with PostCSS
- Custom color schemes for travel branding

### TypeScript
- Strict mode enabled
- DOM library included
- App and Node configuration files

---

## 🌐 API Base URL

**Default:** `http://localhost:5000`

---

## 🚦 Server Status

The server provides health check endpoints:
- Returns uptime and memory usage
- Useful for monitoring

---

## 📋 Summary

This is a comprehensive SaaS platform for travel and merchant services featuring:
- Complete user authentication system
- AI-powered chat and content generation
- Email notification system
- Multi-language support
- Modern React frontend with Vite
- Express backend with MongoDB
- Scalable architecture with environment-based configuration

The application targets MSMEs, developers, workers, and students in the tourism and e-commerce sectors with AI-powered assistance and business intelligence features.

---

**Last Updated:** December 2, 2025
