/**
 * ============================================================================
 * BUILD FLAGS MODULE
 * ============================================================================
 * 
 * Controls feature gating for Free/Pro build variants.
 * 
 * BUILD COMMANDS:
 * - npm run build:free  → For WordPress.org (limited features)
 * - npm run build:pro   → For paying customers (all features)
 * 
 * FREE VERSION:
 * - 1 counter (venue/shortcode)
 * - Unlimited recurring & special events
 * - 1 countdown style
 * 
 * PRO VERSION:
 * - Multiple counters for different locations
 * - Counter Styles settings menu
 * - Priority support
 * 
 * @module buildFlags
 * ============================================================================
 */

import { STORAGE_KEYS, isDevPreview } from './pluginIdentity';

export type BuildVariant = 'free' | 'pro';

const getDevModePro = (): boolean => {
  if (!isDevPreview()) return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.devLicenseMode) === 'pro';
  } catch {
    return false;
  }
};

export const BUILD_VARIANT: BuildVariant = 
  (import.meta.env.VITE_BUILD_VARIANT as BuildVariant) || 'free';

const isDevPro = getDevModePro();

export const BUILD_FLAGS = {
  /**
   * Multi-counter management (+ button in breadcrumb, counter selector)
   * - Free: false → Single counter only
   * - Pro: true → Unlimited counters for different locations
   */
  MULTI_GALLERY_UI: BUILD_VARIANT === 'pro' || isDevPro,

  /**
   * Counter Styles settings menu
   * - Free: false → Single default style
   * - Pro: true → Multiple countdown styles
   */
  COUNTER_STYLES: BUILD_VARIANT === 'pro' || isDevPro,

  /**
   * Analytics features (view/click tracking)
   * - Free: false → No analytics
   * - Pro: true → Full analytics dashboard
   */
  ANALYTICS: BUILD_VARIANT === 'pro' || isDevPro,
} as const;

export const isProBuild = () => BUILD_VARIANT === 'pro' || isDevPro;
export const isFreeBuild = () => BUILD_VARIANT === 'free' && !isDevPro;
