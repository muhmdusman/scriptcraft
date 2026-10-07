import {
  addFontFromFile,
  formatText,
  addPaperFromFile
} from './utils/helpers.mjs';
import {
  generateImages,
  downloadAsPDF,
  deleteAll
} from './generate-images.mjs';
import { setInkColor, toggleDrawCanvas } from './utils/draw.mjs';
import {
  initMonetization,
  getUsageStats,
  isPremiumUser,
} from './monetization.mjs';
import {
  initAnalytics,
  trackButtonClick,
  trackCustomization,
  trackFunnelStep,
  trackError,
} from './analytics.mjs';

/**
 * ScriptCraft - Professional Text to Handwriting Converter
 * 
 * This is the main entry file that handles event listeners and app initialization.
 * Based on text-to-handwriting by Saurabh Daware (MIT License)
 */

// Initialize analytics
try {
  initAnalytics();
  trackFunnelStep('page_load');
} catch (error) {
  console.error('Analytics initialization failed:', error);
}

// Initialize monetization system
const userTier = initMonetization();
console.log('User Tier:', userTier);

// Display usage stats
function updateUsageDisplay() {
  const stats = getUsageStats();
  const existingBanner = document.getElementById('usage-banner');
  if (existingBanner) existingBanner.remove();

  if (stats.type === 'free' && stats.sessionRemaining <= 2) {
    const banner = document.createElement('div');
    banner.id = 'usage-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      font-size: 0.9rem;
      max-width: 300px;
    `;
    banner.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 5px;">⚠️ ${stats.sessionRemaining} images left</div>
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 10px;">${stats.message}</div>
      <a href="#pricing" style="color: white; text-decoration: underline; font-size: 0.85rem;">Upgrade to Premium</a>
    `;
    document.body.appendChild(banner);
  }
}

// Update display on load
updateUsageDisplay();

// Make function globally accessible
window.updateUsageDisplay = updateUsageDisplay;

// Global error handler
window.addEventListener('error', (event) => {
  trackError(event.error || new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Track text input
let textInputTimeout;
document.querySelector('.page-a .paper-content')?.addEventListener('input', () => {
  clearTimeout(textInputTimeout);
  textInputTimeout = setTimeout(() => {
    trackFunnelStep('text_entered');
  }, 2000);
});

const pageEl = document.querySelector('.page-a');

const setTextareaStyle = (attrib, v) => (pageEl.style[attrib] = v);

/**
 * Add event listeners here, they will be automatically mapped with addEventListener later
 */
const EVENT_MAP = {
  '#generate-image-form': {
    on: 'submit',
    action: (e) => {
      e.preventDefault();
      trackButtonClick('generate_image');
      generateImages();
    }
  },
  '#handwriting-font': {
    on: 'change',
    action: (e) => {
      document.body.style.setProperty('--handwriting-font', e.target.value);
      trackCustomization('font', e.target.value);
    }
  },
  '#font-size': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 30) {
        alert('Font-size is too big try upto 30');
      } else {
        setTextareaStyle('fontSize', e.target.value + 'pt');
        trackCustomization('font_size', e.target.value);
        e.preventDefault();
      }
    }
  },
  '#letter-spacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 40) {
        alert('Letter Spacing is too big try a number upto 40');
      } else {
        setTextareaStyle('letterSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  },
  '#word-spacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 100) {
        alert('Word Spacing is too big try a number upto hundred');
      } else {
        setTextareaStyle('wordSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  },
  '#top-padding': {
    on: 'change',
    action: (e) => {
      document.querySelector('.page-a .paper-content').style.paddingTop =
        e.target.value + 'px';
    }
  },
  '#font-file': {
    on: 'change',
    action: (e) => addFontFromFile(e.target.files[0])
  },
  '#ink-color': {
    on: 'change',
    action: (e) => {
      document.body.style.setProperty('--ink-color', e.target.value);
      setInkColor(e.target.value);
    }
  },
  '#paper-margin-toggle': {
    on: 'change',
    action: () => {
      if (pageEl.classList.contains('margined')) {
        pageEl.classList.remove('margined');
      } else {
        pageEl.classList.add('margined');
      }
    }
  },
  '#paper-line-toggle': {
    on: 'change',
    action: () => {
      if (pageEl.classList.contains('lines')) {
        pageEl.classList.remove('lines');
      } else {
        pageEl.classList.add('lines');
      }
    }
  },
  '#draw-diagram-button': {
    on: 'click',
    action: () => {
      toggleDrawCanvas();
    }
  },
  '.draw-container .close-button': {
    on: 'click',
    action: () => {
      toggleDrawCanvas();
    }
  },
  '#download-as-pdf-button': {
    on: 'click',
    action: () => {
      trackButtonClick('download_pdf');
      downloadAsPDF();
    }
  },
  '#delete-all-button': {
    on: 'click',
    action: () => {
      trackButtonClick('delete_all');
      deleteAll();
    }
  },
  '.page-a .paper-content': {
    on: 'paste',
    action: formatText
  },
  '#paper-file': {
    on: 'change',
    action: (e) => addPaperFromFile(e.target.files[0])
  }
};

for (const eventSelector in EVENT_MAP) {
  document
    .querySelector(eventSelector)
    .addEventListener(
      EVENT_MAP[eventSelector].on,
      EVENT_MAP[eventSelector].action
    );
}

/**
 * This makes toggles, accessible.
 */
document.querySelectorAll('.switch-toggle input').forEach((toggleInput) => {
  toggleInput.addEventListener('change', (e) => {
    if (toggleInput.checked) {
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = 'on';
      toggleInput.setAttribute('aria-checked', true);
    } else {
      toggleInput.setAttribute('aria-checked', false);
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = 'off';
    }
  });
});

/**
 * Set GitHub Contributors - Removed for commercial version
 */
// Contributors section removed in commercial version
