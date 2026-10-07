# ScriptCraft Analytics Setup Guide

This guide explains how to set up and use analytics in ScriptCraft.

## Overview

ScriptCraft includes comprehensive analytics tracking for:
- User behavior and engagement
- Conversion funnel tracking
- Feature usage monitoring
- Performance metrics
- Error tracking

## Supported Analytics Services

### 1. Google Analytics 4 (GA4)

**Setup:**

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Update `index.html` with your tracking code:

```html
<!-- Replace placeholder in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID');
</script>
```

**Custom Events Tracked:**
- `page_view` - Page views
- `image_generated` - When user generates an image
- `pdf_downloaded` - PDF downloads
- `upgrade_modal_shown` - Upgrade prompt displayed
- `upgrade_clicked` - Upgrade button clicked
- `button_clicked` - Button interactions
- `customization_changed` - User customizations
- `funnel_step` - Conversion funnel progression
- `subscription_completed` - Premium subscription
- `error_occurred` - JavaScript errors

### 2. Plausible Analytics (Privacy-Friendly)

**Setup:**

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add script to `index.html`:

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

**Benefits:**
- GDPR compliant
- No cookie banner needed
- Lightweight (< 1KB)
- Privacy-focused

### 3. Microsoft Clarity (Heatmaps & Session Recording)

**Setup:**

1. Sign up at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Create a new project
3. Add tracking code to `index.html`:

```html
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR-PROJECT-ID");
</script>
```

**Features:**
- Heatmaps
- Session recordings
- Rage clicks detection
- Dead clicks detection

## Events Reference

### Page Events
```javascript
// Page view
trackPageView('/custom-page');

// Session start
// Automatically tracked on page load
```

### Conversion Events
```javascript
// Image generation
trackImageGeneration({
  pages: 2,
  font: 'Homemade Apple',
  tier: 'free',
  hasWatermark: true,
  resolution: 'high'
});

// PDF download
trackPDFDownload({
  pageCount: 5,
  tier: 'premium'
});

// Upgrade modal shown
trackUpgradeModalShown('session_limit');

// Upgrade clicked
trackUpgradeClicked('modal');

// Trial activation
trackTrialActivation('url_parameter');

// Subscription completed
trackSubscription('monthly', 9.99);
```

### User Interaction Events
```javascript
// Button clicked
trackButtonClick('generate_image', {
  customizations: ['font', 'color']
});

// Feature usage
trackFeatureUsage('custom_font_upload', {
  fontName: 'MyFont.ttf'
});

// Customization changed
trackCustomization('font', 'Caveat');

// User engagement
trackEngagement('page_scroll', {
  depth: 75
});
```

### Funnel Tracking
```javascript
// Track conversion funnel steps
trackFunnelStep('page_load');
trackFunnelStep('text_entered');
trackFunnelStep('customization_opened');
trackFunnelStep('image_generated');
trackFunnelStep('upgrade_shown');
trackFunnelStep('upgrade_clicked');
trackFunnelStep('payment_started');
trackFunnelStep('payment_completed');
```

### Error Tracking
```javascript
// Track errors
trackError(new Error('Image generation failed'), {
  font: 'CustomFont',
  resolution: 'high'
});
```

### A/B Testing
```javascript
// Track A/B test variant
trackABTest('pricing_test', 'variant_b');
```

## Key Metrics to Monitor

### User Acquisition
- Daily/Monthly Active Users (DAU/MAU)
- Traffic sources
- Geographic distribution
- Device types

### Engagement
- Average session duration
- Pages per session
- Scroll depth
- Feature usage rates

### Conversion Funnel
```
Page Load → Text Entry → Customization → Image Generated → Upgrade Shown → Upgrade Clicked → Payment → Subscription
```

Track drop-off rates at each step.

### Product Metrics
- Images generated per user
- Average customizations per generation
- Free vs Premium user ratio
- PDF downloads
- Custom font uploads

### Monetization
- Upgrade modal view rate
- Upgrade click-through rate (CTR)
- Trial activation rate
- Free-to-Premium conversion rate
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (LTV)

### Performance
- Page load time
- Time to interactive
- Image generation time
- Error rate

## Setting Up Custom Dashboards

### Google Analytics 4

1. **Conversion Funnel Dashboard:**
   - Navigate to Explore → Funnel Exploration
   - Add funnel steps:
     1. page_load
     2. text_entered
     3. image_generated
     4. upgrade_shown
     5. upgrade_clicked
     6. subscription_completed

2. **User Engagement Dashboard:**
   - Create custom report with:
     - Active users
     - Engagement rate
     - Average engagement time
     - Events per session

3. **Revenue Dashboard:**
   - Track purchase events
   - Subscription revenue
   - Conversion rate by source

### Plausible Analytics

Create goals for:
- Image Generated
- PDF Downloaded
- Upgrade Clicked
- Subscription Completed

## Privacy Considerations

### Data Collection
- All analytics tracking is anonymous
- No PII (Personally Identifiable Information) collected
- User text content is never sent to analytics
- All processing happens client-side

### GDPR Compliance
- Add cookie consent banner if using Google Analytics
- Document data processing in privacy policy
- Allow users to opt-out
- Use Plausible for cookie-free alternative

### Cookie Consent Implementation
```html
<!-- Example using CookieConsent library -->
<script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"></script>
<script>
window.addEventListener("load", function(){
  window.cookieconsent.initialise({
    "palette": {
      "popup": { "background": "#6366f1" },
      "button": { "background": "#10b981" }
    },
    "content": {
      "message": "We use cookies to analyze traffic and improve your experience.",
      "dismiss": "Got it!",
      "link": "Learn more",
      "href": "/privacy"
    }
  })
});
</script>
```

## Testing Analytics

### Debug Mode

Enable analytics debug mode in browser console:
```javascript
import { enableAnalyticsDebug } from './js/analytics.mjs';
enableAnalyticsDebug();
```

This will log all events to console.

### Google Analytics Debug View

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/) Chrome extension
2. Enable debugger
3. View real-time events in console

### Test Events

```javascript
// Test image generation
trackImageGeneration({ pages: 1, tier: 'free' });

// Test upgrade flow
trackUpgradeModalShown('session_limit');
trackUpgradeClicked('modal');

// Test subscription
trackSubscription('monthly', 9.99);
```

## Integration with Backend (Future)

When you add a backend, track server-side events:

```javascript
// Server-side analytics (Node.js example)
const { Analytics } = require('@segment/analytics-node');
const analytics = new Analytics({
  writeKey: 'YOUR_WRITE_KEY'
});

// Track subscription on server
app.post('/api/subscribe', async (req, res) => {
  // Process payment...
  
  analytics.track({
    userId: user.id,
    event: 'Subscription Completed',
    properties: {
      plan: 'premium_monthly',
      amount: 9.99,
      currency: 'USD'
    }
  });
});
```

## Recommended Analytics Stack

### Minimum (Free)
- Plausible Analytics or GA4
- Built-in analytics module

### Standard
- Google Analytics 4
- Microsoft Clarity
- Built-in analytics module

### Advanced
- Google Analytics 4
- Segment (for data warehouse)
- Mixpanel (product analytics)
- Sentry (error tracking)
- Hotjar or Microsoft Clarity (session recording)

## Common Issues

### Events Not Showing Up

1. **Check browser console** for errors
2. **Verify tracking ID** is correct
3. **Check ad blockers** - they often block analytics
4. **Wait 24-48 hours** for GA4 data processing
5. **Use GA4 DebugView** for real-time validation

### Duplicate Events

- Ensure scripts aren't loaded multiple times
- Check for event tracking in multiple places
- Use event deduplication if needed

### High Bounce Rate

If bounce rate > 70%:
- Check page load speed
- Improve above-the-fold content
- Add clear call-to-action
- Simplify initial user experience

## Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Plausible Documentation](https://plausible.io/docs)
- [Microsoft Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Web Analytics Best Practices](https://analytics.google.com/analytics/academy/)

## Support

Need help with analytics setup?
- Email: support@scriptcraft.app
- Documentation: [scriptcraft.app/docs](#)
- Community: [GitHub Discussions](#)
