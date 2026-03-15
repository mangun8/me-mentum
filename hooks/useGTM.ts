'use client';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
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
  };

  const trackPageView = (url: string) => {
    push({
      event: 'page_view',
      page_location: url,
    });
  };

  return { push, trackLogin, trackPageView };
}
