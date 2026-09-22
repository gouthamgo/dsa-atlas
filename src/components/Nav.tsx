"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/today", label: "Today" },
  { href: "/plan", label: "Plan" },
  { href: "/map", label: "Map" },
  { href: "/patterns", label: "Patterns" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight">
          Atlas
        </Link>
        <nav className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[var(--surface-2)] text-[var(--ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
