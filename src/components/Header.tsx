"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
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
      <nav className="mx-auto flex max-w-6xl items-center px-8 py-4">
        
        {/* LEFT */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight hover:opacity-80"
        >
          Jaroslav Drobek
        </Link>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3 text-sm">
          {items.map((it) => {
            const active = isActive(pathname, it.href);

            return (
              <Link
                key={it.href}
                href={it.href}
                className={
                  active
                    ? "rounded-full bg-black px-3 py-1.5 text-white"
                    : "rounded-full px-3 py-1.5 text-gray-600 hover:text-black"
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