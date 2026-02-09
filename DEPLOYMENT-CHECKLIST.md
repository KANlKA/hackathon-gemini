# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment Setup

### 1. Services Setup
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and connection string obtained
- [ ] Upstash Redis database created
- [ ] Google Cloud project created
- [ ] YouTube Data API enabled
- [ ] Google OAuth credentials created
- [ ] Gemini API key obtained
- [ ] Mailjet account created and sender email verified
- [ ] Vercel account created
- [ ] Render account created

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env.local` for local testing
- [ ] Fill in all required values in `.env.local`
- [ ] Test locally with `npm run dev`
- [ ] Generate secrets with OpenSSL:
  ```bash
  openssl rand -base64 32  # For AUTH_SECRET
  openssl rand -base64 32  # For CRON_SECRET
  openssl rand -base64 32  # For UNSUBSCRIBE_SECRET
  ```
- [ ] Run `node scripts/check-env.js` to verify all variables are set

### 3. Code Preparation
- [ ] All code committed to Git
- [ ] Push to GitHub/GitLab/Bitbucket
- [ ] Verify `vercel.json` configuration
- [ ] Verify `render.yaml` configuration
- [ ] Update `.vercelignore` if needed

## Vercel Deployment

### 4. Initial Setup
- [ ] Repository connected to Vercel
- [ ] Framework preset set to Next.js
- [ ] All environment variables added to Vercel
- [ ] `NEXT_PUBLIC_APP_URL` set correctly
- [ ] Initial deployment successful

### 5. Post-Deployment
- [ ] Deployment URL noted
- [ ] Update `NEXT_PUBLIC_APP_URL` with actual Vercel URL
- [ ] Redeploy if URL was updated
- [ ] Cron jobs verified in Vercel dashboard
- [ ] Function logs checked for errors

### 6. OAuth Configuration
- [ ] Google OAuth redirect URL updated with Vercel URL:
  - `https://your-app.vercel.app/api/auth/callback/google`
- [ ] OAuth tested with sign-in flow
- [ ] User data loads correctly after sign-in

## Render Deployment

### 7. Workers Setup
- [ ] Background worker created on Render
- [ ] Repository connected
- [ ] Build command: `npm install`
- [ ] Start command: `npm run worker`
- [ ] All environment variables added
- [ ] Worker deployed successfully

### 8. Workers Verification
- [ ] Worker logs show successful startup
- [ ] Redis connection established
- [ ] MongoDB connection established
- [ ] Test job processing (trigger an action that queues a job)
- [ ] Email job runs successfully

## Testing

### 9. Functional Testing
- [ ] App loads without errors
- [ ] Sign in with Google works
- [ ] Dashboard displays correctly
- [ ] Video data loads
- [ ] Ideas generation works
- [ ] Video analysis works
- [ ] Engagement timeline displays
- [ ] Brand collaboration analysis works
- [ ] All action buttons work (mark as video, save for later, dismiss)
- [ ] Filtered idea tabs work correctly

### 10. Email Testing
- [ ] Weekly ideas email sends correctly
- [ ] Email content renders properly
- [ ] Unsubscribe link works
- [ ] Email preferences save correctly

### 11. Performance Testing
- [ ] Page load times acceptable
- [ ] API responses fast (< 2s)
- [ ] Database queries optimized
- [ ] Redis caching working

## Post-Deployment

### 12. Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (optional: Sentry)
- [ ] Uptime monitoring configured (optional: UptimeRobot)
- [ ] Log aggregation setup reviewed

### 13. Custom Domain (Optional)
- [ ] Domain purchased
- [ ] DNS configured in Vercel
- [ ] SSL certificate verified
- [ ] `NEXT_PUBLIC_APP_URL` updated with custom domain
- [ ] Google OAuth redirect URLs updated with custom domain

### 14. Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Team members have access to necessary services
- [ ] Backup/recovery plan created

### 15. Security Review
- [ ] All secrets are secure and not in Git
- [ ] `.env.local` in `.gitignore`
- [ ] OAuth redirect URLs restricted to production domain
- [ ] API keys have appropriate restrictions
- [ ] Database has IP whitelist configured
- [ ] Cron endpoints protected with `CRON_SECRET`
- [ ] HTTPS enforced everywhere

## Maintenance

### 16. Regular Tasks
- [ ] Set up calendar reminder for monthly dependency updates
- [ ] Set up billing alerts for all services
- [ ] Create runbook for common issues
- [ ] Document incident response procedures
- [ ] Schedule quarterly security audits

---

## Quick Commands

### Local Development
```bash
npm run dev              # Start dev server
npm run worker           # Start workers locally
npm run build            # Test production build
node scripts/check-env.js # Verify environment variables
```

### Deployment
```bash
git push origin main     # Auto-deploys to Vercel & Render
vercel --prod           # Manual Vercel deployment
```

### Monitoring
```bash
# Check Vercel logs
vercel logs --follow

# Check Render logs
# Go to Render Dashboard > Workers > Logs
```

---

## Troubleshooting

If deployment fails, check:
1. ✅ All environment variables are set correctly
2. ✅ Database connection string is valid
3. ✅ Redis connection is working
4. ✅ All API keys are active
5. ✅ Build logs in Vercel dashboard
6. ✅ Worker logs in Render dashboard
7. ✅ MongoDB Atlas network access allows all IPs

---

## Success Criteria

Your deployment is successful when:
- ✅ App is accessible at your URL
- ✅ Users can sign in with Google
- ✅ Dashboard shows user data
- ✅ All features work as expected
- ✅ Background jobs process correctly
- ✅ Emails send successfully
- ✅ No errors in logs
- ✅ Performance is acceptable

---

**Date Deployed:** _____________

**Deployed By:** _____________

**Production URL:** _____________

**Notes:**
