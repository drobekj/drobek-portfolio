import Link from "next/link";
import { repo } from "@/lib/data/localRepository";

export const metadata = {
  title: "Applications",
};

export default async function ApplicationsPage() {
  const cat = await repo.getCatalog("applications");

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Applications</h1>

      <p className="mt-2 text-sm text-gray-500">
        Interactive applications and software projects.
      </p>

      <div className="mt-8 grid gap-5">
        {cat.topics.map((t) => {
          const text = t.summary ?? t.description;

          return (
            <Link
              key={t.slug}
              href={`/applications/${t.slug}`}
              className="group rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-lg font-semibold leading-snug">
                {t.title}
              </div>

              {text && (
                <div className="mt-3 text-sm text-gray-500 leading-relaxed">
                  {text}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
