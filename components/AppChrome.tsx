"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

/**
 * Faithful port of the prototype frame: #koraa-root (full-bleed gradient
 * backdrop, centers the device) > #phone-frame (the app surface). Each
 * Next.js route renders as a ".view" inside the frame, and #bottom-nav
 * persists like the prototype bottom bar. The nav is hidden on /auth,
 * and on full-bleed sub-views that own their bottom edge (chat).
 */
export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/auth");
  const isChat = /^\/messages\/[^/]+$/.test(pathname);
  const showNav = !isAuth && !isChat;

  return (
    <div id="koraa-root">
      <div id="phone-frame">
        {isAuth ? (
          children
        ) : (
          <div id="app-shell" style={{ position: "absolute", inset: 0 }}>
            {children}
            {showNav && <BottomNav />}
          </div>
        )}
      </div>
    </div>
  );
}
