import Link from "next/link";
import { repo } from "@/lib/data/localRepository";
import { PrimaryTopicCard } from "@/components/PrimaryTopicCard";

export const metadata = {
  title: "Research",
};

export default async function ResearchPage() {
  const cat = await repo.getCatalog("research");

  const dissertation = cat.topics.find(
    (topic) => topic.slug === "dissertation-cvbem"
  );

  const publications = cat.topics.filter(
    (topic) => topic.slug !== "dissertation-cvbem"
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Research</h1>

      <p className="mt-2 text-sm text-gray-500">
        Publications and academic work.
      </p>

      {dissertation ? (
        <div className="mt-8">
          <PrimaryTopicCard
            href={`/research/${dissertation.slug}`}
            title={dissertation.title}
            description={dissertation.summary}
            label={undefined}
          />
        </div>
      ) : null}

      <div className={dissertation ? "mt-6 grid gap-5" : "mt-8 grid gap-5"}>
        {publications.map((t) => (
          <Link
            key={t.slug}
            href={`/research/${t.slug}`}
            className="group rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-lg font-semibold leading-snug">{t.title}</div>

            {t.summary && (
              <div className="mt-3 text-sm text-gray-500 leading-relaxed">
                {t.summary}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}