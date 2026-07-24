"use client";

import { useEffect } from "react";

/**
 * Registers the hand-rolled service worker (public/sw.js). See the comment
 * in next.config.js for why we didn't use the next-pwa package.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal: app still works without offline support.
      });
    }
  }, []);

  return null;
}
