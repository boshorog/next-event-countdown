/**
 * ============================================================================
 * APP ENTRY COMPONENT
 * ============================================================================
 * 
 * Root component that sets up providers and handles iframe height sync
 * for WordPress embedding.
 * 
 * FEATURES:
 * - Query client provider for React Query
 * - Tooltip provider for accessible tooltips
 * - Toast notifications
 * - Iframe height synchronization with parent WordPress page
 * 
 * REUSE NOTES:
 * - This is a framework component, minimal customization needed
 * - Update POST_MESSAGE_HEIGHT if plugin prefix changes
 * 
 * @module App
 * ============================================================================
 */

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { POST_MESSAGE_HEIGHT } from "@/config/pluginIdentity";
import Index from "./pages/Index";
import ScrollOnboardingShowcase from "./components/ScrollOnboardingShowcase";
import CountersPageShowcase from "./components/CountersPageShowcase";
import ColorPickerShowcase from "./components/ColorPickerShowcase";
import ColorDisplayShowcase from "./components/ColorDisplayShowcase";
import PreviewTabShowcase from "./components/PreviewTabShowcase";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = new URLSearchParams(window.location.search).get('frameToken') || undefined;
    
    // Measure the actual mount, never the iframe viewport (which feeds back
    // into document/body scrollHeight after the parent changes the frame).
    const rootEl = document.getElementById('nxevtcd-root') || document.getElementById('root');
    if (!rootEl) return;
    let lastHeight = 0;
    let timeout = 0;
    let rafId = 0;
    const postHeight = () => {
      const contentHeight = Math.ceil((Math.max(rootEl.scrollHeight, rootEl.getBoundingClientRect().height) + 24) / 8) * 8;
      if (contentHeight > 0 && Math.abs(contentHeight - lastHeight) > 4) {
        lastHeight = contentHeight;
        window.parent.postMessage({ type: POST_MESSAGE_HEIGHT, height: contentHeight, token }, '*');
      }
    };
    // Debounce without a throttle: late tab/data changes must never be dropped.
    const schedule = () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
      timeout = window.setTimeout(() => { rafId = requestAnimationFrame(postHeight); }, 150);
    };
    const onHeightCheck = (event: MessageEvent) => {
      if (event.source !== window.parent || event.data?.type !== `${POST_MESSAGE_HEIGHT}-check` || event.data?.token !== token) return;
      lastHeight = 0;
      schedule();
    };
    const timers = [300, 1000, 2000, 4000, 8000].map(ms => window.setTimeout(postHeight, ms));
    const ro = new ResizeObserver(schedule);
    ro.observe(rootEl);
    const mo = new MutationObserver(schedule);
    mo.observe(rootEl, { childList: true, subtree: true, attributes: true });
    window.addEventListener('load', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('message', onHeightCheck);
    document.fonts?.ready.then(schedule);
    return () => {
      clearTimeout(timeout);
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('load', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('message', onHeightCheck);
    };
  }, []);

  // Show showcase if ?showcase=... is in URL
  const showcaseParam = new URLSearchParams(window.location.search).get('showcase');

  const renderContent = () => {
    if (showcaseParam === 'scroll-onboarding') return <ScrollOnboardingShowcase />;
    if (showcaseParam === 'counters-page') return <CountersPageShowcase />;
    if (showcaseParam === 'color-picker') return <ColorPickerShowcase />;
    if (showcaseParam === 'color-display') return <ColorDisplayShowcase />;
    if (showcaseParam === 'preview-tab') return <PreviewTabShowcase />;
    return <Index />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {renderContent()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
