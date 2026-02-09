# Deployment Guide: Vercel + Render

This guide will help you deploy CreatorMind to production using Vercel (for the Next.js app) and Render (for background workers).

## Architecture Overview

- **Vercel**: Hosts the Next.js application (frontend + API routes + cron jobs)
- **Render**: Hosts the BullMQ background workers
- **MongoDB Atlas**: Database (cloud-hosted)
- **Upstash Redis**: Queue management and caching

---

## Prerequisites

1. **Accounts Required:**
   - [Vercel Account](https://vercel.com/signup)
   - [Render Account](https://render.com/register)
   - [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)
   - [Upstash Account](https://upstash.com/)
   - [Google Cloud Console](https://console.cloud.google.com/) (for OAuth & YouTube API)
   - [Google AI Studio](https://aistudio.google.com/) (for Gemini API)
   - [Mailjet Account](https://www.mailjet.com/) (for emails)

2. **Tools:**
   - [Vercel CLI](https://vercel.com/cli) (optional)
   - Git repository (GitHub, GitLab, or Bitbucket)

---

## Step 1: Set Up Database & Services

### 1.1 MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist `0.0.0.0/0` (all IPs) in Network Access
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 1.2 Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Select a region close to your users
4. Note down these values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `UPSTASH_REDIS_URL` (redis:// format)

### 1.3 Google Cloud Setup

#### Enable APIs:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - YouTube Data API v3
   - Google+ API (for OAuth)

#### Create OAuth Credentials:
1. Go to **APIs & Services > Credentials**
2. Create **OAuth 2.0 Client ID**
3. Add authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)
4. Note down:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

#### Get YouTube API Key:
1. Go to **APIs & Services > Credentials**
2. Create **API Key**
3. Restrict it to YouTube Data API v3
4. Note down: `YOUTUBE_API_KEY`

### 1.4 Google AI Studio (Gemini)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create API key
3. Note down: `GEMINI_API_KEY`

### 1.5 Mailjet Setup

1. Sign up at [Mailjet](https://www.mailjet.com/)
2. Verify your sender email/domain
3. Go to **Account Settings > API Keys**
4. Note down:
   - `MAILJET_API_KEY`
   - `MAILJET_SECRET_KEY`
   - `MAILJET_SENDER_EMAIL` (your verified email)

---

## Step 2: Generate Secrets

Run these commands to generate secure random secrets:

```bash
# Generate AUTH_SECRET (for NextAuth)
openssl rand -base64 32

# Generate CRON_SECRET (for cron job security)
openssl rand -base64 32

# Generate UNSUBSCRIBE_SECRET (for email unsubscribe tokens)
openssl rand -base64 32
```

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Connect Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your Git repository

2. **Configure Build Settings:**
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables:**
   Click "Environment Variables" and add all variables from `.env.example`:

   ```env
   MONGODB_URI=mongodb+srv://...
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   UPSTASH_REDIS_URL=redis://...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   YOUTUBE_API_KEY=...
   GEMINI_API_KEY=...
   AUTH_SECRET=... (generated above)
   AUTH_GOOGLE_ID=${GOOGLE_CLIENT_ID}
   AUTH_GOOGLE_SECRET=${GOOGLE_CLIENT_SECRET}
   MAILJET_API_KEY=...
   MAILJET_SECRET_KEY=...
   MAILJET_SENDER_EMAIL=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   CRON_SECRET=... (generated above)
   UNSUBSCRIBE_SECRET=... (generated above)
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Note your deployment URL (e.g., `https://creatormind.vercel.app`)

5. **Update Environment Variables:**
   - Go back to Settings > Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
   - Redeploy if needed

6. **Configure Cron Jobs:**
   - Cron jobs are automatically configured via `vercel.json`
   - Verify in **Settings > Cron Jobs**
   - The email cron job runs every minute: `*/1 * * * *`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables interactively
vercel env add MONGODB_URI
vercel env add UPSTASH_REDIS_REST_URL
# ... add all other variables

# Deploy to production
vercel --prod
```

---

## Step 4: Deploy Workers to Render

### Option A: Via Render Dashboard (Recommended)

1. **Connect Repository:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" > "Background Worker"
   - Connect your Git repository

2. **Configure Worker:**
   - **Name:** `creatormind-workers`
   - **Runtime:** Node
   - **Branch:** `main` (or your default branch)
   - **Build Command:** `npm install`
   - **Start Command:** `npm run worker`
   - **Plan:** Starter ($7/month) or Free

3. **Add Environment Variables:**
   Go to "Environment" tab and add:
   - All the same variables from Vercel (MongoDB, Redis, APIs, etc.)
   - Make sure `NODE_ENV=production`

4. **Deploy:**
   - Click "Create Background Worker"
   - Monitor logs to ensure workers start successfully

### Option B: Via render.yaml (Blueprint)

1. Push `render.yaml` to your repository
2. Go to Render Dashboard
3. Click "New +" > "Blueprint"
4. Select your repository
5. Render will auto-detect `render.yaml`
6. Fill in all environment variables manually
7. Click "Apply"

---

## Step 5: Update OAuth Redirect URLs

After deployment, update Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client
4. Add authorized redirect URI:
   ```
   https://your-vercel-url.vercel.app/api/auth/callback/google
   ```
5. Save changes

---

## Step 6: Test Your Deployment

### Test Checklist:

- [ ] App loads at your Vercel URL
- [ ] Sign in with Google works
- [ ] Dashboard loads with user data
- [ ] Ideas generation works
- [ ] Video analysis works
- [ ] Email notifications work (check worker logs)
- [ ] Cron jobs execute (check Vercel logs)

### Check Logs:

**Vercel:**
- Dashboard > Your Project > Functions > Logs
- Check for API errors and cron execution

**Render:**
- Dashboard > creatormind-workers > Logs
- Check for worker job processing

---

## Step 7: Set Up Custom Domain (Optional)

### On Vercel:

1. Go to Project Settings > Domains
2. Add your custom domain
3. Add DNS records from your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Update environment variables:
   - Change `NEXT_PUBLIC_APP_URL` to your custom domain
5. Update Google OAuth redirect URLs with custom domain

---

## Monitoring & Maintenance

### Monitor Application Health:

1. **Vercel Analytics:**
   - Enable in Project Settings > Analytics
   - Monitor page views, performance, errors

2. **Render Metrics:**
   - Check worker CPU/memory usage
   - Monitor job processing times

3. **Database Monitoring:**
   - MongoDB Atlas > Metrics
   - Watch connection counts, storage

4. **Redis Monitoring:**
   - Upstash Console > Metrics
   - Check memory usage, command counts

### Regular Maintenance:

- **Update Dependencies:** Run `npm update` monthly
- **Monitor Costs:** Check Vercel, Render, MongoDB, Upstash billing
- **Review Logs:** Check for errors weekly
- **Database Backups:** MongoDB Atlas auto-backups enabled
- **Security Updates:** Update Node.js and dependencies regularly

---

## Troubleshooting

### Common Issues:

**Build Fails on Vercel:**
- Check environment variables are set
- Verify all dependencies in `package.json`
- Check build logs for TypeScript errors

**Workers Not Processing Jobs:**
- Verify Redis connection string is correct
- Check worker logs on Render
- Ensure all API keys are valid

**OAuth Errors:**
- Verify redirect URLs in Google Console
- Check `AUTH_SECRET` is set
- Ensure `NEXT_PUBLIC_APP_URL` matches actual URL

**MongoDB Connection Errors:**
- Verify connection string format
- Check database user permissions
- Whitelist all IPs (0.0.0.0/0) in Atlas

**Email Not Sending:**
- Verify Mailjet sender email is verified
- Check Mailjet API credentials
- Review worker logs for errors

---

## Cost Estimation (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 (Free) |
| Vercel | Pro | $20/month |
| Render Workers | Free | $0 |
| Render Workers | Starter | $7/month |
| MongoDB Atlas | M0 | $0 (Free, 512MB) |
| MongoDB Atlas | M10 | $57/month |
| Upstash Redis | Free | $0 (10K commands/day) |
| Upstash Redis | Pay as you go | ~$0.20/100K commands |
| Google APIs | Free | $0 (within quotas) |
| Mailjet | Free | $0 (6K emails/month) |

**Recommended Starting Setup: ~$0-7/month**
- Vercel Hobby (free)
- Render Free or Starter ($0-7)
- MongoDB Atlas M0 (free)
- Upstash Free
- Mailjet Free

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Upstash Redis REST token |
| `UPSTASH_REDIS_URL` | Yes | Redis connection URL |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth secret |
| `YOUTUBE_API_KEY` | Yes | YouTube Data API key |
| `GEMINI_API_KEY` | Yes | Google Gemini AI API key |
| `AUTH_SECRET` | Yes | NextAuth secret key |
| `MAILJET_API_KEY` | Yes | Mailjet API key |
| `MAILJET_SECRET_KEY` | Yes | Mailjet secret key |
| `MAILJET_SENDER_EMAIL` | Yes | Verified sender email |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app URL |
| `NODE_ENV` | Yes | Set to `production` |
| `CRON_SECRET` | Yes | Secret for cron endpoints |
| `UNSUBSCRIBE_SECRET` | Yes | Secret for unsubscribe tokens |

---

## Support & Documentation

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/

---

## Security Checklist

- [ ] All environment variables are set and secure
- [ ] `AUTH_SECRET` is a strong random string
- [ ] OAuth redirect URLs are restricted to your domain
- [ ] MongoDB Atlas has IP whitelist configured
- [ ] API keys have appropriate restrictions
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Cron endpoints are protected with `CRON_SECRET`
- [ ] Email unsubscribe links use signed tokens
- [ ] Production environment variables are not committed to Git
- [ ] `.env.local` is in `.gitignore`

---

## Next Steps After Deployment

1. Monitor your first few user signups
2. Test all features in production
3. Set up error monitoring (Sentry, LogRocket, etc.)
4. Configure analytics (Google Analytics, PostHog, etc.)
5. Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
6. Create a backup/disaster recovery plan
7. Document your deployment process for your team

---

**Congratulations! Your CreatorMind app is now live!** 🎉
