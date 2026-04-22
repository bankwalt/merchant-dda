import { useEffect, useRef } from "react";

// TODO(stage-3): swap the console sink for the Jaris Segment/analytics
// client on the monorepo side. Prototype keeps events visible in the
// browser console so the funnel shape is easy to inspect during review.

export type FunnelEvent =
  | "intro_viewed"
  | "review_viewed"
  | "agreements_viewed"
  | "disclosure_accepted"
  | "funds_viewed"
  | "activate_clicked"
  | "activation_failed"
  | "success_viewed"
  | "wallet_add_succeeded"
  | "wallet_add_failed"
  | "support_opened";

export function track(event: FunnelEvent, props?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.info(`[funnel] ${event}`, { ts: new Date().toISOString(), ...props });
}

// Fires a single screen-view event on mount, guarded against React
// StrictMode's intentional double-invoke in dev.
export function useScreenView(event: FunnelEvent, props?: Record<string, unknown>) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
