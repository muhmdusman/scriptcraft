/**
 * ScriptCraft Monetization Module
 * Handles freemium features, usage tracking, and premium upgrades
 */

// Free tier limits (CURRENTLY DISABLED - Everything is free)
const FREE_TIER_LIMITS = {
  imagesPerSession: 999999, // Unlimited for now
  imagesPerDay: 999999, // Unlimited for now
  pdfPagesMax: 999999, // Unlimited for now
  customFonts: true, // Enabled for everyone
  watermark: false, // No watermark for now
  highResolution: true, // Enabled for everyone
};

// Premium tier features
const PREMIUM_FEATURES = {
  unlimitedImages: true,
  unlimitedPDF: true,
  customFonts: true,
  noWatermark: true,
  highResolution: true,
  prioritySupport: true,
  advancedCustomization: true,
};

// Storage keys
const STORAGE_KEYS = {
  sessionCount: 'scriptcraft_session_count',
  dailyCount: 'scriptcraft_daily_count',
  lastResetDate: 'scriptcraft_last_reset',
  isPremium: 'scriptcraft_is_premium',
  premiumExpiry: 'scriptcraft_premium_expiry',
};

/**
 * Initialize monetization system
 */
export function initMonetization() {
  resetDailyCountIfNeeded();
  checkPremiumStatus();
  return getUserTier();
}

/**
 * Get current user tier
 */
export function getUserTier() {
  const isPremium = isPremiumUser();
  return {
    type: isPremium ? 'premium' : 'free',
    limits: isPremium ? PREMIUM_FEATURES : FREE_TIER_LIMITS,
  };
}

/**
 * Check if user is premium
 */
export function isPremiumUser() {
  const isPremium = localStorage.getItem(STORAGE_KEYS.isPremium) === 'true';
  const expiryDate = localStorage.getItem(STORAGE_KEYS.premiumExpiry);
  
  if (isPremium && expiryDate) {
    const expiry = new Date(expiryDate);
    if (expiry > new Date()) {
      return true;
    } else {
      // Premium expired
      localStorage.removeItem(STORAGE_KEYS.isPremium);
      localStorage.removeItem(STORAGE_KEYS.premiumExpiry);
      return false;
    }
  }
  
  return false;
}

/**
 * Track image generation (limits disabled for now)
 */
export function trackImageGeneration() {
  // All users have unlimited access for now
  return {
    allowed: true,
    remaining: 'unlimited',
  };
}

/**
 * Reset daily count if needed
 */
function resetDailyCountIfNeeded() {
  const lastReset = localStorage.getItem(STORAGE_KEYS.lastResetDate);
  const today = new Date().toDateString();

  if (lastReset !== today) {
    localStorage.setItem(STORAGE_KEYS.dailyCount, '0');
    localStorage.setItem(STORAGE_KEYS.lastResetDate, today);
  }
}

/**
 * Check premium status
 */
function checkPremiumStatus() {
  // Check URL parameters for premium activation
  const urlParams = new URLSearchParams(window.location.search);
  const premiumCode = urlParams.get('premium');
  
  if (premiumCode) {
    activatePremium(premiumCode);
  }
}

/**
 * Activate premium with code
 */
function activatePremium(code) {
  // In production, validate code with backend
  // For demo, accept specific codes
  const validCodes = ['DEMO', 'TRIAL', 'PREMIUM'];
  
  if (validCodes.includes(code.toUpperCase())) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days trial
    
    localStorage.setItem(STORAGE_KEYS.isPremium, 'true');
    localStorage.setItem(STORAGE_KEYS.premiumExpiry, expiryDate.toISOString());
    
    return true;
  }
  
  return false;
}

/**
 * Show upgrade modal
 */
export function showUpgradeModal(reason = 'limit_reached') {
  const modal = document.createElement('div');
  modal.id = 'upgrade-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  const modalContent = `
    <div style="
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      padding: 50px 40px;
      border-radius: 20px;
      max-width: 600px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      color: white;
    ">
      <button onclick="document.getElementById('upgrade-modal').remove()" style="
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        font-size: 24px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        line-height: 1;
      ">&times;</button>
      
      <div style="font-size: 60px; margin-bottom: 20px;">🚀</div>
      <h2 style="font-size: 2rem; margin-bottom: 15px; color: white;">Upgrade to Premium</h2>
      <p style="font-size: 1.1rem; margin-bottom: 30px; color: rgba(255,255,255,0.9);">
        Unlock unlimited potential with ScriptCraft Premium
      </p>
      
      <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 12px; margin-bottom: 30px; backdrop-filter: blur(10px);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left;">
          <div>✓ Unlimited images</div>
          <div>✓ No watermarks</div>
          <div>✓ Custom fonts</div>
          <div>✓ High resolution</div>
          <div>✓ Unlimited PDF pages</div>
          <div>✓ Priority support</div>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <div style="font-size: 3rem; font-weight: 800; color: white;">$9.99<span style="font-size: 1.2rem; font-weight: 400;">/month</span></div>
        <div style="color: rgba(255,255,255,0.8); margin-top: 5px;">or $79.99/year (save 33%)</div>
      </div>
      
      <button onclick="window.location.href='#pricing'" style="
        background: white;
        color: #6366f1;
        padding: 18px 50px;
        border-radius: 12px;
        font-size: 1.2rem;
        font-weight: 700;
        border: none;
        cursor: pointer;
        margin-bottom: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
      " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
        Upgrade Now
      </button>
      
      <div style="margin-top: 20px;">
        <a href="?premium=TRIAL" style="color: white; text-decoration: underline; font-size: 0.9rem;">
          Start 30-day free trial
        </a>
      </div>
    </div>
  `;

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Track upgrade prompt
  if (typeof gtag !== 'undefined') {
    gtag('event', 'upgrade_modal_shown', {
      reason: reason,
    });
  }
}

/**
 * Add watermark to free tier images (disabled for now)
 */
export function addWatermark(canvas, ctx) {
  // Watermark disabled - everyone gets clean images
  return;
}

/**
 * Get usage stats for display (disabled for now)
 */
export function getUsageStats() {
  // Everyone has unlimited access
  return {
    type: 'free',
    message: 'Free: Unlimited access',
  };
}

// Add fade in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);
