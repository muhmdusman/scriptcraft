# ScriptCraft Deployment Guide

This guide will help you deploy ScriptCraft to production.

## Prerequisites

- Node.js 14+ installed
- Git repository set up
- Domain name (optional but recommended)

## Quick Deploy Options

### Option 1: Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. **Connect your repository:**
   ```bash
   git remote add origin https://github.com/muhmdusman/scriptcraft.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect settings from `vercel.json`
   - Click "Deploy"

3. **Configure environment variables:**
   - Go to Project Settings → Environment Variables
   - Add variables from `.env.example`

4. **Custom domain (optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. **Connect your repository:**
   ```bash
   git remote add origin https://github.com/muhmdusman/scriptcraft.git
   git push -u origin main
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider
   - Select your repository
   - Build settings are configured in `netlify.toml`
   - Click "Deploy site"

3. **Configure environment variables:**
   - Go to Site Settings → Environment Variables
   - Add variables from `.env.example`

4. **Custom domain (optional):**
   - Go to Domain Settings → Add custom domain
   - Update DNS records as instructed

### Option 3: Deploy to GitHub Pages

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy using GitHub Actions:**
   - Create `.github/workflows/deploy.yml` (see below)
   - Push to main branch
   - GitHub will automatically deploy

3. **GitHub Actions workflow:**
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: .
   ```

## Post-Deployment Setup

### 1. Configure Analytics

#### Google Analytics 4
1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Update `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

#### Plausible Analytics (Privacy-friendly alternative)
1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add script to `index.html`:
   ```html
   <script defer data-domain="scriptcraft.app" src="https://plausible.io/js/script.js"></script>
   ```

### 2. Set Up Payment Processing

#### Stripe Integration
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products and pricing:
   - Monthly: $9.99/month
   - Yearly: $79.99/year
3. Get your publishable key from Dashboard
4. Create a payment page or use Stripe Checkout
5. Update `js/monetization.mjs` with your Stripe keys

#### Example Stripe Checkout Integration:
```javascript
// In monetization.mjs
const stripe = Stripe('pk_live_YOUR_KEY');

export async function upgradeToPremium(priceId) {
  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    successUrl: `${window.location.origin}/?premium=success`,
    cancelUrl: `${window.location.origin}/?premium=cancel`,
  });
  
  if (error) {
    console.error('Stripe error:', error);
  }
}
```

### 3. Email Setup (for support & notifications)

Choose an email service:
- **SendGrid**: [sendgrid.com](https://sendgrid.com)
- **Mailgun**: [mailgun.com](https://mailgun.com)
- **AWS SES**: [aws.amazon.com/ses](https://aws.amazon.com/ses)

### 4. SEO Optimization

1. **Update meta tags** in `index.html`:
   - Replace placeholder URLs with your domain
   - Update social media images
   - Add structured data (JSON-LD)

2. **Create sitemap.xml:**
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://scriptcraft.app/</loc>
       <priority>1.0</priority>
       <changefreq>weekly</changefreq>
     </url>
   </urlset>
   ```

3. **Create robots.txt:**
   ```
   User-agent: *
   Allow: /
   Sitemap: https://scriptcraft.app/sitemap.xml
   ```

4. **Submit to search engines:**
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 5. Performance Optimization

1. **Enable CDN** (both Vercel and Netlify have built-in CDN)
2. **Optimize images** using tools like [TinyPNG](https://tinypng.com)
3. **Enable compression** (configured in `vercel.json` and `netlify.toml`)
4. **Monitor performance** with:
   - [Google PageSpeed Insights](https://pagespeed.web.dev)
   - [GTmetrix](https://gtmetrix.com)

### 6. Security Checklist

- ✅ HTTPS enabled (automatic with Vercel/Netlify)
- ✅ Security headers configured
- ✅ CSP (Content Security Policy) headers
- ✅ Regular dependency updates (`npm audit`)
- ✅ Rate limiting (consider Cloudflare)
- ✅ DDoS protection

## Monitoring & Maintenance

### Error Tracking
Set up error tracking with:
- **Sentry**: [sentry.io](https://sentry.io)
- **LogRocket**: [logrocket.com](https://logrocket.com)

### Uptime Monitoring
- **UptimeRobot**: [uptimerobot.com](https://uptimerobot.com)
- **Pingdom**: [pingdom.com](https://pingdom.com)

### Analytics Dashboard
Monitor key metrics:
- Daily active users
- Image generations
- Conversion rate (free → premium)
- Page load time
- Error rate

## Scaling Considerations

### When you need to scale:
1. **Move to serverless functions** for premium features
2. **Add database** (Supabase, Firebase) for user management
3. **Implement user authentication** (Auth0, Firebase Auth)
4. **Add API layer** for mobile apps
5. **CDN optimization** for global performance

## Support

For deployment issues:
- Check deployment logs in your hosting dashboard
- Review browser console for JavaScript errors
- Test in incognito mode to avoid caching issues
- Contact hosting support if needed

## Backup & Disaster Recovery

1. **Regular backups:**
   - Git repository is your source of truth
   - Export analytics data monthly
   - Backup customer list from Stripe

2. **Recovery plan:**
   - Keep deployment documentation updated
   - Test deployment to staging environment
   - Have rollback plan ready

## Cost Estimates

### Monthly costs (estimate):
- **Hosting (Vercel/Netlify)**: $0-20 (free tier usually sufficient)
- **Analytics (Plausible)**: $0-9
- **Payment processing (Stripe)**: 2.9% + $0.30 per transaction
- **Domain**: $10-15/year
- **Email service**: $0-15

**Total estimated monthly cost**: $10-50

---

## Quick Start Commands

```bash
# Local development
npm run dev

# Test production build
npm run build
npm run start

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

---

**Need help?** Open an issue in the repository or contact support@scriptcraft.app
