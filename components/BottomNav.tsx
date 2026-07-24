"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

/**
 * Faithful port of the prototype's #bottom-nav (renderBottomNav / navItems).
 * Order and labels lifted 1:1 from index (3).html: feed→Actualité,
 * discover→Boutique, create→Créer (+), messages→Messages, profile→Profil.
 */
const NAV_ITEMS: {
  href: string;
  match: string;
  label: string;
  icon: IconName;
  isCreate?: boolean;
}[] = [
  { href: "/", match: "/", label: "Actualité", icon: "feed" },
  { href: "/discover", match: "/discover", label: "Boutique", icon: "compass" },
  { href: "/create", match: "/create", label: "Créer", icon: "plus", isCreate: true },
  { href: "/messages", match: "/messages", label: "Messages", icon: "message" },
  { href: "/profile", match: "/profile", label: "Profil", icon: "user" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav id="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const active =
          item.match === "/" ? pathname === "/" : pathname.startsWith(item.match);
        if (item.isCreate) {
          return (
            <Link key={item.href} href={item.href} className="nav-btn create-btn">
              <Icon name={item.icon} size={22} />
              <span>{item.label}</span>
            </Link>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-btn ${active ? "active" : ""}`}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
