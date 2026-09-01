// Fire-and-forget wrapper around GA4's gtag for custom events. The gtag
// script only loads in production builds (see the Scripts in
// src/app/layout.tsx), so everywhere else — dev, tests, a visitor with the
// script blocked — window.gtag is simply absent and this is a no-op.
// Analytics must never break the feature it's measuring.

type GtagFn = (...args: unknown[]) => void;

export function trackEvent(
  name: string,
  params?: Record<string, string | number>
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as { gtag?: GtagFn }).gtag;
  gtag?.("event", name, params);
}
