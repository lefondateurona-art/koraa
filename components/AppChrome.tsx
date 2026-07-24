"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { PageTransition } from "./PageTransition";

/**
 * Shows the bottom nav on every authenticated route; hides it on /auth
 * (and any nested chat/detail pages that want a full-bleed view can still
 * render inside the shell, the nav simply persists like the prototype's
 * bottom bar).
 */
export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="app-shell">
      <PageTransition>{children}</PageTransition>
      {!isAuth && <BottomNav />}
    </div>
  );
}
