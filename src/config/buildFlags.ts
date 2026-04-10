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
 * - Unlimited counters (unrestricted)
 * - Unlimited recurring & special events
 * - 1 countdown style
 * 
 * PRO VERSION:
 * - Counter Styles settings menu
 * - Analytics dashboard
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
   * Always enabled — free version supports unlimited counters
   */
  MULTI_GALLERY_UI: true,

  /**
   * Bulk upload UI (not used in countdown plugin)
   * Kept false for compatibility with shared components
   */
  BULK_UPLOAD_UI: false,

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
