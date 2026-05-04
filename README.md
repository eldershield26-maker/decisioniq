# DecisionIQ — Deployment Guide

## Project Structure

```
decisioniq/
├── api/
│   └── analyze.js        ← Secure serverless function (holds your API key)
├── public/
│   └── index.html        ← The full frontend
├── vercel.json           ← Routing config
├── package.json
└── README.md
```

---

## Deploy to Vercel (Free — 5 minutes)

### Step 1 — Get your Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in → **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`) — save it somewhere safe

### Step 2 — Push to GitHub
1. Create a new repo at [github.com/new](https://github.com/new)
2. Name it `decisioniq`, set to Public or Private (both work)
3. Upload all these files maintaining the folder structure:
   - `api/analyze.js`
   - `public/index.html`
   - `vercel.json`
   - `package.json`

   **Easiest way:** Use GitHub's web interface → "uploading an existing file"  
   Or via terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/decisioniq.git
   git push -u origin main
   ```

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your `decisioniq` repository
4. Leave all settings as default — click **Deploy**
5. Wait ~30 seconds for the first deploy to finish

### Step 4 — Add your API Key (critical!)
1. In Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Click **Add New**:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (your key from Step 1)
   - **Environment:** ✅ Production ✅ Preview ✅ Development
3. Click **Save**
4. Go to **Deployments** → click the three dots on latest → **Redeploy**

### Step 5 — Done!
Your app is live at `https://decisioniq-YOUR_USERNAME.vercel.app`

---

## How It Works (Security)

```
Browser  →  POST /api/analyze  →  Vercel Function  →  Anthropic API
              (no key needed)      (key stays here)     (key used here)
```

Your API key **never** touches the browser. It lives only in Vercel's encrypted environment variables. Anyone can use the frontend, but they can never steal your key.

---

## Updating the App

Any push to your `main` branch auto-deploys to Vercel within ~30 seconds. No manual steps needed.

---

## Costs

- **Vercel:** Free tier is more than enough (100GB bandwidth/month)
- **Anthropic API:** ~$0.003 per analysis (claude-sonnet-4). 1,000 analyses ≈ $3

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "API key not configured" error | Check env variable name is exactly `ANTHROPIC_API_KEY` and redeploy |
| 404 on `/api/analyze` | Make sure `vercel.json` is in the root, not inside a subfolder |
| Blank page | Open browser DevTools → Console for errors |
| CORS error | Shouldn't happen with this setup — if it does, redeploy |
