import Link from "next/link";
import { notFound } from "next/navigation";

import { repo } from "@/lib/data/localRepository";

type ResearchTopicPageProps = {
  params: Promise<{
    topicSlug: string;
  }>;
};

export default async function ResearchTopicPage({
  params,
}: ResearchTopicPageProps) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("research", topicSlug);

  if (!topic) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <Link href="/research" className="text-sm opacity-80 hover:opacity-100">
          ← Back to Research
        </Link>
      </div>

      <article className="rounded-2xl border p-8">
        <h1 className="text-2xl font-semibold leading-tight">
          {topic.title}
        </h1>

        {topic.authors && (
          <p className="mt-4 text-sm opacity-70">{topic.authors}</p>
        )}

        {(topic.journal || topic.year) && (
          <p className="mt-1 text-sm opacity-70">
            {topic.journal}
            {topic.journal && topic.year ? " · " : ""}
            {topic.year}
          </p>
        )}

        {topic.summary && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Abstract</h2>
            <p className="mt-2 text-sm leading-7">{topic.summary}</p>
          </div>
        )}

        {topic.slug === "dissertation-cvbem" && (
          <div className="mt-6 text-sm leading-7">
            <span className="font-semibold">Context:</span>{" "}
            This dissertation builds upon and extends the results presented in the related journal publications listed in this section.
          </div>
        )}

        {topic.keyContribution && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Key contribution</h2>
            <p className="mt-2 text-sm leading-7">{topic.keyContribution}</p>
          </div>
        )}

        {topic.keywords && topic.keywords.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold">Keywords</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topic.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border px-3 py-1 text-xs opacity-80"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8">
          <a
            href={topic.doiUrl ?? topic.pdfPath ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-black/5"
          >
            {topic.slug === "dissertation-cvbem"
              ? "View dissertation (PDF)"
              : topic.linkLabel}
          </a>
        </div>     
     </article>
    </main>
  );
}