"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/applications", label: "Applications" },
  { href: "/ml-ds", label: "ML/DS" },
  { href: "/insurance", label: "Insurance" },
  { href: "/research", label: "Research" },
  { href: "/vs", label: "University" },
  { href: "/ss", label: "High School" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (pathname === href) return true;
  if (pathname.startsWith(href + "/")) return true;
  return false;
}

export function Header() {
  const pathname = usePathname() || "/";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-0 lg:px-8 lg:py-4">
        <Link
          href="/"
          className="self-start text-sm font-semibold tracking-tight hover:opacity-80"
        >
          Jaroslav Drobek
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm lg:ml-auto lg:justify-end lg:gap-3">
          {items.map((it) => {
            const active = isActive(pathname, it.href);

            return (
              <Link
                key={it.href}
                href={it.href}
                className={
                  active
                    ? "whitespace-nowrap rounded-full bg-black px-2.5 py-1 text-white sm:px-3 sm:py-1.5"
                    : "whitespace-nowrap rounded-full px-2.5 py-1 text-gray-600 hover:text-black sm:px-3 sm:py-1.5"
                }
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
