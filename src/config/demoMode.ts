/**
 * ============================================================================
 * DEMO MODE CONFIGURATION
 * ============================================================================
 * 
 * Controls the "Demo Mode" feature used on the website (kindpixels.com) for
 * potential customers to try the plugin's backend without affecting real data.
 * 
 * BEHAVIOR:
 * - Forces Free version (no Pro features)
 * - Hides UpdateNotice and footer
 * - Resets to default countdown config on every page load (sessionStorage only)
 * - All changes are temporary (lost on tab/window close)
 * - Skips WP/localStorage persistence entirely
 * 
 * ACTIVATION:
 * - Via [nxevtcd_demo] shortcode in WordPress
 * - Via ?demo=true URL parameter (for dev testing)
 * - Via window.nxevtcdData.isDemo = true (set by PHP)
 * 
 * @module demoMode
 * ============================================================================
 */

import { getWPGlobal } from './pluginIdentity';

/**
 * Check if the app is running in Demo Mode
 */
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check WP global (set by PHP shortcode)
  const wp = getWPGlobal();
  if (wp?.isDemo === true || wp?.isDemo === 'true' || wp?.isDemo === '1') {
    return true;
  }

  // Check URL parameter (for dev testing and iframe shortcode)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('demo') === 'true') {
    return true;
  }

  return false;
};

/**
 * Session-scoped storage key for demo countdown config
 * Uses sessionStorage so data is lost when tab/window closes
 */
const DEMO_SESSION_KEY = 'nxevtcd_demo_session';

/**
 * Save demo countdown config to sessionStorage
 */
export const saveDemoConfig = (config: any): void => {
  try {
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(config));
  } catch {}
};

/**
 * Load demo countdown config from sessionStorage
 * Returns null if no state exists (triggers fresh default config)
 */
export const loadDemoConfig = (): any | null => {
  try {
    const raw = sessionStorage.getItem(DEMO_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}
  return null;
};

/**
 * Clear demo session data
 */
export const clearDemoConfig = (): void => {
  try {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  } catch {}
};
