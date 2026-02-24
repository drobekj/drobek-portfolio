import Link from "next/link";

const sections = [
  {
    href: "/insurance",
    title: "Insurance projekty",
    desc: "Praktické ukázky práce s daty, modely a reporty.",
  },
  {
    href: "/research",
    title: "Research",
    desc: "Dizertace, publikace, odborné výstupy.",
  },
  {
    href: "/vs",
    title: "VŠ learning",
    desc: "Univerzitní materiály strukturované podle okruhů.",
  },
  {
    href: "/ss",
    title: "SŠ learning",
    desc: "Středoškolská matematika přehledně podle okruhů.",
  },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-2 text-sm text-gray-500">
        Navigace mezi projekty, materiály a výstupy.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-xl font-semibold tracking-tight">{s.title}</div>
            <div className="mt-3 text-sm text-gray-500">{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}