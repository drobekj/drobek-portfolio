import { notFound } from "next/navigation";
import { repo } from "@/lib/data/localRepository";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("insurance", topicSlug);

  if (!topic) {
    return { title: "Insurance" };
  }

  return { title: topic.title };
}

export default async function InsuranceTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("insurance", topicSlug);

  if (!topic) {
    return notFound();
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { href: "/insurance", label: "Insurance" },
          { href: `/insurance/${topic.slug}`, label: topic.title },
        ]}
      />

      <div className="mt-2 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{topic.title}</h1>
      </div>

      <div className="mt-8 max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {topic.summary ? (
            <div>
              <h2 className="text-base font-semibold">Context</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {topic.summary}
              </p>
            </div>
          ) : null}

          {topic.keyContribution ? (
            <div>
              <h2 className="text-base font-semibold">Key contribution</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {topic.keyContribution}
              </p>
            </div>
          ) : null}

          {topic.keywords && topic.keywords.length > 0 ? (
            <div>
              <h2 className="text-base font-semibold">Technical highlights</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {topic.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {topic.tools && topic.tools.length > 0 ? (
            <div>
              <h2 className="text-base font-semibold">Tools / stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {topic.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {(topic.pdfPath || topic.doiUrl) ? (
            <div className="pt-2">
              <a
                href={topic.doiUrl || topic.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                {topic.linkLabel ||
                  (topic.doiUrl ? "View resource" : "Download PDF")}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}