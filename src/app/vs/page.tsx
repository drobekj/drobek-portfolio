import Link from "next/link";
import { repo } from "@/lib/data/localRepository";

export default async function VSPage() {
  const cat = await repo.getCatalog("vs");

  return (
    <div>
      <h1 className="text-2xl font-semibold">VŠ learning</h1>
      <p className="mt-2 text-sm opacity-80">Okruhy univerzitní matematiky.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cat.topics.map((t) => (
          <Link
            key={t.slug}
            href={`/vs/${t.slug}`}
            className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-lg font-semibold tracking-tight">{t.title}</div>
            <div className="mt-3 text-sm text-gray-500">{t.items.length} PDF</div>
          </Link>
        ))}
      </div>
    </div>
  );
}