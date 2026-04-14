import Link from "next/link";

import { repo } from "@/lib/data/localRepository";

export default async function ResearchPage() {
  const catalog = await repo.getCatalog("research");

  const dissertation = catalog.topics.find(
    (topic) => topic.slug === "dissertation-cvbem"
  );

  const publications = catalog.topics.filter(
    (topic) => topic.slug !== "dissertation-cvbem"
  );

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Research</h1>
      <p className="mt-2 text-sm opacity-80">
        Dissertation, publications, and research outputs.
      </p>

      <div className="mt-6 space-y-4">
        {dissertation && (
          <Link
            href={`/research/${dissertation.slug}`}
            className="block rounded-2xl border-2 border-gray-300 bg-gray-50 p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="mb-1 text-sm font-medium text-gray-600">
                  Dissertation
                </div>

                <h2 className="text-lg font-semibold leading-snug">
                  {dissertation.title}
                </h2>

                {(dissertation.journal || dissertation.year) && (
                  <p className="mt-2 text-sm opacity-70">
                    {dissertation.journal}
                    {dissertation.journal && dissertation.year ? " · " : ""}
                    {dissertation.year}
                  </p>
                )}
              </div>
            </div>
          </Link>
        )}

        {publications.map((topic) => (
          <Link
            key={topic.slug}
            href={`/research/${topic.slug}`}
            className="block rounded-2xl border p-6 transition hover:bg-black/5"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold leading-snug">
                  {topic.title}
                </h2>

                {(topic.journal || topic.year) && (
                  <p className="mt-2 text-sm opacity-70">
                    {topic.journal}
                    {topic.journal && topic.year ? " · " : ""}
                    {topic.year}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}