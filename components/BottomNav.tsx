"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const items = [
  { href: "/", label: "Accueil", icon: "home" as const },
  { href: "/shop", label: "Boutique", icon: "shop" as const },
  { href: "/create", label: "Publier", icon: "plus" as const, fab: true },
  { href: "/messages", label: "Message", icon: "message" as const },
  { href: "/profile", label: "Profil", icon: "user" as const },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        if (item.fab) {
          return (
            <Link key={item.href} href={item.href} className="nav-fab" aria-label={item.label}>
              <Icon name="plus" size={22} />
            </Link>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={`nav-btn ${active ? "active" : ""}`}>
            <Icon name={item.icon} size={21} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
