'use client';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function useGTM() {
  const push = (event: Record<string, unknown>) => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  };

  const trackLogin = (userId: string) => {
    push({
      event: 'login',
      user_id: userId,
      method: 'google',
    });
    // Also fire directly to GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'login', { method: 'google', user_id: userId });
    }
  };

  const trackPageView = (url: string) => {
    push({
      event: 'page_view',
      page_location: url,
    });
  };

  return { push, trackLogin, trackPageView };
}
