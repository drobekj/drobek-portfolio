import Link from "next/link";
import { repo } from "@/lib/data/localRepository";

export const metadata = {
  title: "ML/DS",
};

export default async function MlDsPage() {
  const cat = await repo.getCatalog("ml-ds");

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">ML/DS</h1>
      <p className="mt-2 text-sm text-gray-500">
        Machine Learning a Data Science projekty.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cat.topics.map((t) => (
          <Link
            key={t.slug}
            href={`/ml-ds/${t.slug}`}
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