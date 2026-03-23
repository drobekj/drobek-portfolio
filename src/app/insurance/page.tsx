import Link from "next/link";
import { repo } from "@/lib/data/localRepository";

export const metadata = {
  title: "Insurance",
};

export default async function InsurancePage() {
  const cat = await repo.getCatalog("insurance");

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Insurance</h1>
      <p className="mt-2 text-sm text-gray-500">Insurance projekty a ukázky.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cat.topics.map((t) => (
          <Link
            key={t.slug}
            href={`/insurance/${t.slug}`}
            className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-lg font-semibold tracking-tight">
              {t.title}
            </div>
            <div className="mt-3 text-sm text-gray-500">
              {t.items.length}{" "}
{t.items.length === 1
? "položka"
: t.items.length >= 2 && t.items.length <= 4
? "položky"
: "položek"}

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}