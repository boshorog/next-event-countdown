import { getWPGlobal } from './pluginIdentity';

export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const flag = getWPGlobal()?.isDemo;
  return flag === true || flag === 'true' || flag === '1' ||
    new URLSearchParams(window.location.search).get('demo') === 'true';
};

// Demo changes belong to this tab, never the real WordPress/local backup data.
export const loadDemoConfig = <T,>(fallback: T): T => {
  try {
    const raw = sessionStorage.getItem('nxevtcd_demo_config');
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

export const saveDemoConfig = (config: unknown): void => {
  try { sessionStorage.setItem('nxevtcd_demo_config', JSON.stringify(config)); } catch {}
};