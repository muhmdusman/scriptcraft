/**
 * ScriptCraft Analytics Module
 * Centralized analytics tracking for user events
 */

// Analytics configuration
const ANALYTICS_CONFIG = {
  googleAnalytics: {
    enabled: false,
    measurementId: '', // Set from environment or config
  },
  plausible: {
    enabled: false,
    domain: 'scriptcraft.app',
  },
  customEvents: true,
};

/**
 * Initialize analytics services
 */
export function initAnalytics() {
  // Check if Google Analytics is loaded
  if (typeof gtag !== 'undefined') {
    ANALYTICS_CONFIG.googleAnalytics.enabled = true;
    console.log('✓ Google Analytics initialized');
  }

  // Check if Plausible is loaded
  if (typeof plausible !== 'undefined') {
    ANALYTICS_CONFIG.plausible.enabled = true;
    console.log('✓ Plausible Analytics initialized');
  }

  // Track page view
  trackPageView();

  // Track session start
  trackEvent('session_start', {
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
  });
}

/**
 * Track page view
 */
export function trackPageView(pagePath = window.location.pathname) {
  if (ANALYTICS_CONFIG.googleAnalytics.enabled) {
    gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  if (ANALYTICS_CONFIG.plausible.enabled) {
    plausible('pageview');
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName, eventParams = {}) {
  // Add common parameters
  const params = {
    ...eventParams,
    timestamp: new Date().toISOString(),
  };

  // Google Analytics 4
  if (ANALYTICS_CONFIG.googleAnalytics.enabled) {
    gtag('event', eventName, params);
  }

  // Plausible
  if (ANALYTICS_CONFIG.plausible.enabled) {
    plausible(eventName, { props: params });
  }

  // Console log for debugging
  if (ANALYTICS_CONFIG.customEvents) {
    console.log(`📊 Event: ${eventName}`, params);
  }
}

/**
 * Track image generation
 */
export function trackImageGeneration(data) {
  trackEvent('image_generated', {
    pages: data.pages || 1,
    font: data.font || 'default',
    tier: data.tier || 'free',
    has_watermark: data.hasWatermark || false,
    resolution: data.resolution || 'normal',
  });
}

/**
 * Track PDF download
 */
export function trackPDFDownload(data) {
  trackEvent('pdf_downloaded', {
    page_count: data.pageCount || 1,
    tier: data.tier || 'free',
  });
}

/**
 * Track upgrade modal shown
 */
export function trackUpgradeModalShown(reason) {
  trackEvent('upgrade_modal_shown', {
    reason: reason,
    trigger_point: getUpgradeTriggerPoint(reason),
  });
}

/**
 * Track upgrade button clicked
 */
export function trackUpgradeClicked(source) {
  trackEvent('upgrade_clicked', {
    source: source, // 'modal', 'banner', 'header', etc.
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(feature, details = {}) {
  trackEvent('feature_used', {
    feature_name: feature,
    ...details,
  });
}

/**
 * Track customization changes
 */
export function trackCustomization(type, value) {
  trackEvent('customization_changed', {
    customization_type: type, // 'font', 'color', 'spacing', etc.
    customization_value: value,
  });
}

/**
 * Track errors
 */
export function trackError(error, context = {}) {
  trackEvent('error_occurred', {
    error_message: error.message || error.toString(),
    error_stack: error.stack || '',
    error_context: JSON.stringify(context),
  });

  // Send to error tracking service if available
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(error, { extra: context });
  }
}

/**
 * Track user engagement
 */
export function trackEngagement(action, details = {}) {
  trackEvent('user_engagement', {
    engagement_action: action,
    ...details,
  });
}

/**
 * Track conversion funnel
 */
export function trackFunnelStep(step, data = {}) {
  const funnelSteps = {
    'page_load': 1,
    'text_entered': 2,
    'customization_opened': 3,
    'image_generated': 4,
    'upgrade_shown': 5,
    'upgrade_clicked': 6,
    'payment_started': 7,
    'payment_completed': 8,
  };

  trackEvent('funnel_step', {
    step_name: step,
    step_number: funnelSteps[step] || 0,
    ...data,
  });
}

/**
 * Track time on page
 */
let pageLoadTime = Date.now();

export function trackTimeOnPage() {
  const timeSpent = Math.round((Date.now() - pageLoadTime) / 1000); // in seconds
  
  trackEvent('time_on_page', {
    duration_seconds: timeSpent,
    duration_minutes: Math.round(timeSpent / 60),
  });
}

// Track time on page before user leaves
window.addEventListener('beforeunload', () => {
  trackTimeOnPage();
});

/**
 * Track scroll depth
 */
let maxScrollDepth = 0;

function trackScrollDepth() {
  const scrollPercentage = Math.round(
    ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
  );

  if (scrollPercentage > maxScrollDepth) {
    maxScrollDepth = scrollPercentage;

    // Track at 25%, 50%, 75%, 100%
    if ([25, 50, 75, 100].includes(scrollPercentage)) {
      trackEvent('scroll_depth', {
        depth_percentage: scrollPercentage,
      });
    }
  }
}

// Throttled scroll tracking
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(trackScrollDepth, 100);
});

/**
 * Track button clicks
 */
export function trackButtonClick(buttonName, context = {}) {
  trackEvent('button_clicked', {
    button_name: buttonName,
    ...context,
  });
}

/**
 * Track external link clicks
 */
export function setupExternalLinkTracking() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname !== window.location.hostname) {
      trackEvent('external_link_clicked', {
        url: link.href,
        text: link.textContent.trim(),
      });
    }
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmission(formName, success = true, errorMessage = '') {
  trackEvent('form_submitted', {
    form_name: formName,
    success: success,
    error_message: errorMessage,
  });
}

/**
 * Track premium trial activation
 */
export function trackTrialActivation(source) {
  trackEvent('trial_activated', {
    activation_source: source,
    trial_duration_days: 30,
  });
}

/**
 * Track premium subscription
 */
export function trackSubscription(plan, amount) {
  trackEvent('subscription_completed', {
    plan_type: plan, // 'monthly' or 'yearly'
    amount: amount,
    currency: 'USD',
  });

  // Track as conversion
  if (ANALYTICS_CONFIG.googleAnalytics.enabled) {
    gtag('event', 'purchase', {
      transaction_id: `sub_${Date.now()}`,
      value: amount,
      currency: 'USD',
      items: [{
        item_name: `ScriptCraft Premium - ${plan}`,
        item_category: 'Subscription',
        price: amount,
        quantity: 1,
      }],
    });
  }
}

/**
 * Helper function to determine upgrade trigger point
 */
function getUpgradeTriggerPoint(reason) {
  const triggerMap = {
    'session_limit': 'session_limit_reached',
    'daily_limit': 'daily_limit_reached',
    'custom_font': 'custom_font_clicked',
    'high_res': 'high_resolution_clicked',
    'pdf_limit': 'pdf_limit_reached',
    'watermark': 'watermark_notice',
  };
  
  return triggerMap[reason] || 'other';
}

/**
 * Set user properties (for Google Analytics)
 */
export function setUserProperties(properties) {
  if (ANALYTICS_CONFIG.googleAnalytics.enabled) {
    gtag('set', 'user_properties', properties);
  }
}

/**
 * Track A/B test variant
 */
export function trackABTest(testName, variant) {
  trackEvent('ab_test_variant', {
    test_name: testName,
    variant: variant,
  });

  // Set as user property for segmentation
  setUserProperties({
    [`ab_${testName}`]: variant,
  });
}

/**
 * Track performance metrics
 */
export function trackPerformance() {
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    
    if (perfData) {
      trackEvent('performance_metrics', {
        page_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
        time_to_interactive: Math.round(perfData.domInteractive - perfData.fetchStart),
      });
    }
  }
}

// Track performance on page load
window.addEventListener('load', () => {
  setTimeout(trackPerformance, 0);
});

/**
 * Debug mode
 */
export function enableAnalyticsDebug() {
  ANALYTICS_CONFIG.customEvents = true;
  console.log('📊 Analytics debug mode enabled');
}

export function disableAnalyticsDebug() {
  ANALYTICS_CONFIG.customEvents = false;
  console.log('📊 Analytics debug mode disabled');
}

// Initialize external link tracking
setupExternalLinkTracking();

export default {
  init: initAnalytics,
  trackPageView,
  trackEvent,
  trackImageGeneration,
  trackPDFDownload,
  trackUpgradeModalShown,
  trackUpgradeClicked,
  trackFeatureUsage,
  trackCustomization,
  trackError,
  trackEngagement,
  trackFunnelStep,
  trackButtonClick,
  trackTrialActivation,
  trackSubscription,
  setUserProperties,
  trackABTest,
};
