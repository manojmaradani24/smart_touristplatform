# Render Deployment Guide - SmartMerchant Backend

This file explains how to deploy the backend (`/backend`) to Render using the included `render.yaml` manifest or via the Render dashboard.

## Options

### Option A — Deploy using `render.yaml` (recommended)
1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Choose **Connect a repository** → Authorize GitHub if needed
4. Select the `manojmaradani24/smart_touristplatform` repository
5. Render should detect `render.yaml` and create a service named `smartmerchant-backend` with the settings in the file
6. Add the required environment variables (see below) in the Render service settings
7. Deploy — Render will run `cd backend && npm ci` then `cd backend && npm start`

### Option B — Create service manually via Render dashboard
1. Click **New** → **Web Service**
2. Select repo `manojmaradani24/smart_touristplatform`, branch `main`
3. Set **Root Directory** to `/` (repo root)
4. Set **Build Command** to: `cd backend && npm ci`
5. Set **Start Command** to: `cd backend && npm start`
6. Set the environment to **Node** and plan to **Free** (or as you prefer)
7. Add the environment variables (below) and deploy

## Required Environment Variables
Add these in Render service → Environment:

- `MONGODB_URI`  (e.g., mongodb+srv://user:pass@cluster0.mongodb.net/dbname)
- `JWT_SECRET`  (secret for your JWT tokens)
- `OPENAI_API_KEY`  (optional — for OpenAI integration)
- `OPENROUTER_API_KEY` (optional — fallback AI provider)
- `OPENAI_MODEL` (optional — e.g., `gpt-3.5-turbo`)
- `OPENROUTER_MODEL` (optional — e.g., `mistral/mistral-7b-instruct`)
- `EMAIL_USER` (Gmail address used by Nodemailer)
- `EMAIL_PASS` (app password)
- `PORT` (optional, default 5000)

## Post-deploy steps
1. When the service is live, copy the service URL (e.g., `https://smartmerchant-backend.onrender.com`)
2. In Netlify (frontend), set `VITE_BACKEND_URL` (or `VITE_API_BASE_URL`) environment variables to that URL
3. Trigger a frontend deploy on Netlify to pick up new environment variables

## Notes
- The `render.yaml` in the repo includes `autoDeploy: true` so Render will redeploy on each push to `main`.
- Do not commit `.env` files or secrets to GitHub. Use Render’s environment variable UI.

---

If you want, I can now:
- Push the `render.yaml` and `RENDER_DEPLOYMENT.md` to GitHub (I will commit and push), and/or
- Walk you through the Render dashboard steps interactively.

Tell me which next action you want me to take.