"use client";

import { useEffect } from "react";

/** Tells the inline reveal script that React has hydrated, so it can mark elements without a mismatch. */
export function HydrationSignal() {
  useEffect(() => {
    (window as unknown as { __ddgHydrated?: boolean }).__ddgHydrated = true;
    window.dispatchEvent(new Event("ddg:hydrated"));
  }, []);
  return null;
}
