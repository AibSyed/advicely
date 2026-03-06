"use client";

import NextLink from "next/link";
import { useLinkStatus } from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { FiBookmark, FiClock, FiCompass, FiInfo } from "react-icons/fi";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  href: Route;
  title: string;
  description: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  { href: "/", title: "Deck", description: "Draw a fresh card.", icon: FiCompass },
  { href: "/saved", title: "Library", description: "Saved cards worth keeping.", icon: FiBookmark },
  { href: "/history", title: "Recent", description: "Latest draws and recalls.", icon: FiClock },
  { href: "/sources", title: "Sources", description: "Where the deck comes from.", icon: FiInfo },
];

function isActive(pathname: string, href: Route): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/saved") {
    return pathname === "/saved" || pathname.startsWith("/copy/");
  }

  return pathname === href;
}

function DesktopNavCard({ item, active }: { item: NavItem; active: boolean }) {
  const { pending } = useLinkStatus();
  const Icon = item.icon;

  return (
    <div className={cn("nav-card", active && "nav-card--active", pending && "nav-card--pending")}>
      <div className="nav-card__track" aria-hidden="true">
        {pending ? <span className="nav-card-pulse" /> : active ? <span className="nav-card__active-bar" /> : null}
      </div>

      <div className="nav-card__body">
        <span className="nav-card__icon">
          <Icon aria-hidden="true" />
        </span>
        <span className="nav-card__copy">
          <span className="nav-card__title">{item.title}</span>
          <span className="nav-card__description">{pending ? `Opening ${item.title.toLowerCase()}...` : item.description}</span>
        </span>
      </div>
    </div>
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="nav-rail" aria-label="Primary">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <NextLink key={item.href} href={item.href} className={cn("nav-pill", active && "nav-pill--active")} aria-current={active ? "page" : undefined}>
              <span className="nav-pill__icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="nav-pill__label">{item.title}</span>
            </NextLink>
          );
        })}
      </nav>

      <nav className="nav-grid" aria-label="Primary">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <NextLink key={item.href} href={item.href} className="nav-grid__link" aria-current={active ? "page" : undefined}>
              <DesktopNavCard item={item} active={active} />
            </NextLink>
          );
        })}
      </nav>
    </>
  );
}
