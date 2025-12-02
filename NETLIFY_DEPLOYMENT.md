# Netlify Deployment Guide - SmartMerchant SaaS

## 📋 Prerequisites

1. **Netlify Account** - Sign up at https://app.netlify.com
2. **GitHub Account** - Already connected with the repository
3. **Backend deployed** - Deploy backend first (see Backend Deployment section)

---

## 🚀 Frontend Deployment (React + Vite)

### Step 1: Connect GitHub to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** as your Git provider
4. Authenticate and select the repository: `smart_touristplatform`
5. Click **Connect**

### Step 2: Configure Build Settings

**Netlify will auto-detect your project. Verify these settings:**

- **Base directory:** `SmartMerchant-saas-main`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`

These are already configured in `netlify.toml`

### Step 3: Set Environment Variables

In **Site settings → Build & deploy → Environment:**

Add these variables:
```
VITE_API_BASE_URL=https://your-backend-api-url.com
VITE_BACKEND_URL=https://your-backend-api-url.com
```

Replace `your-backend-api-url.com` with your actual backend URL.

### Step 4: Deploy

1. Click **"Deploy site"**
2. Netlify will build and deploy automatically
3. Your site will be live at a URL like: `https://your-site-name.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Enter your domain and follow the DNS setup instructions

---

## 🔧 Backend Deployment

Since Netlify is primarily for frontend hosting, you need to deploy the backend separately:

### Option 1: Render (Recommended - Free tier available)

1. Go to https://render.com
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:** Add all from `.env`:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `OPENAI_API_KEY`
     - `OPENROUTER_API_KEY`
     - `EMAIL_USER`
     - `EMAIL_PASS`
     - `PORT=5000`
5. Deploy and note the backend URL

### Option 2: Railway

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repository
4. Add environment variables
5. Deploy

### Option 3: Heroku

1. Go to https://heroku.com
2. Create new app
3. Connect GitHub
4. Add buildpacks: Node.js
5. Add environment variables
6. Deploy

---

## 🔄 Update API URL After Backend Deployment

Once backend is deployed:

1. Copy your backend URL (e.g., `https://smartmerchant-backend.onrender.com`)
2. In Netlify Dashboard → **Site settings → Build & deploy → Environment**
3. Update `VITE_BACKEND_URL` with your backend URL
4. Trigger a new deploy: **Deploys → Trigger deploy**

---

## 🛡️ Security Configuration

### Environment Variables to Set in Netlify:

```
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_BACKEND_URL=https://your-backend-domain.com
NODE_ENV=production
```

**Never** commit `.env` files to GitHub. Use Netlify's environment variables dashboard.

---

## 📱 Redirects Configuration

The `netlify.toml` file includes:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures React Router works correctly by redirecting all routes to `index.html`.

---

## ✅ Testing After Deployment

1. Visit your Netlify URL
2. Test authentication (login/register)
3. Check console for API calls in Network tab
4. Verify environment variables are loaded correctly

**If you see CORS errors:**
- Backend needs proper CORS headers
- Ensure backend URL is whitelisted in `server.js`

---

## 🚨 Troubleshooting

### Build Fails
- Check **Deploys → Deploy log**
- Ensure all dependencies in `package.json` are correct
- Verify Node.js version compatibility

### API Calls Fail
- Check backend deployment status
- Verify `VITE_BACKEND_URL` is set correctly
- Check CORS settings in backend

### White Screen of Death
- Check browser console for errors
- Verify build succeeded in deploy log
- Check that API endpoint is reachable

---

## 📊 Monitoring

**Netlify provides:**
- Build time tracking
- Deployment history
- Performance monitoring
- Analytics dashboard

Check these regularly in your Site settings.

---

## 🔄 Continuous Deployment

Every time you push to GitHub:
1. Netlify automatically detects the push
2. Triggers a new build
3. Deploys automatically if build succeeds
4. Sends deployment notifications

---

## 💡 Performance Tips

1. Enable **Netlify Asset Optimization**
2. Use **Netlify Functions** for serverless backend (advanced)
3. Enable **HTTP/2 Push** for static assets
4. Use **Netlify CDN** (automatic)

---

## 📞 Support

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Support:** https://app.netlify.com/support
- **GitHub Issues:** Create issues in your repository

---

**Last Updated:** December 2, 2025
