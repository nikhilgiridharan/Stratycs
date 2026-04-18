"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileText, Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home, match: (p: string) => p === "/dashboard" },
  {
    href: "/quotes",
    label: "Quotes",
    icon: FileText,
    match: (p: string) => p.startsWith("/quotes"),
  },
  {
    href: "/pricebook",
    label: "Price Book",
    icon: ClipboardList,
    match: (p: string) => p.startsWith("/pricebook"),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    match: (p: string) => p.startsWith("/settings"),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-navbar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1 px-2 py-2">
        {items.map(({ href, label, icon: Icon, match }) => {
          const isActive = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
