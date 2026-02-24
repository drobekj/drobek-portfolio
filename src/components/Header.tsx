"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/insurance", label: "Insurance" },
  { href: "/research", label: "Research" },
  { href: "/vs", label: "VŠ learning" },
  { href: "/ss", label: "SŠ learning" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (pathname === href) return true;

  if (pathname.startsWith(href + "/")) return true;

  return false;
}

export function Header() {
  const pathname = usePathname() || "/";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur dark:bg-black/60">
      <nav className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight hover:opacity-80">
          Drobek
        </Link>

        <div className="ml-auto flex items-center gap-2 text-sm">
          {items.map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  "rounded-full px-3 py-1.5 transition hover:opacity-80",
                  active
                    ? "border bg-black text-white dark:bg-white dark:text-black"
                    : "border-transparent",
                ].join(" ")}
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