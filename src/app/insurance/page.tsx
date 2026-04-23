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
      <p className="mt-2 text-sm text-gray-500">Insurance projects and actuarial modeling case studies.</p>

      <div className="mt-6 grid gap-4">
        {cat.topics.map((t) => (
          <Link
            key={t.slug}
            href={`/insurance/${t.slug}`}
            className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-lg font-semibold tracking-tight">
              {t.title}
            </div>

            {t.summary && (
              <div className="mt-3 text-sm text-gray-500">
                {t.summary}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}