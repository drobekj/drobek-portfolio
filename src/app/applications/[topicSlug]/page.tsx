import Link from "next/link";
import { notFound } from "next/navigation";
import { repo } from "@/lib/data/localRepository";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("applications", topicSlug);

  if (!topic) {
    return { title: "Applications" };
  }

  return { title: topic.title };
}

export default async function ApplicationsTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("applications", topicSlug);

  if (!topic) {
    return notFound();
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { href: "/applications", label: "Applications" },
          { href: `/applications/${topic.slug}`, label: topic.title },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {topic.title}
          </h1>

          {topic.description ? (
            <p className="mt-2 text-sm text-gray-500">{topic.description}</p>
          ) : null}
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {topic.items.length} {topic.items.length === 1 ? "item" : "items"}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {topic.items.map((item) => {
          const isInternalLink = item.pdfPath.startsWith("/");
          const isJobAgentDashboard = item.id === "job_agent_dashboard";

          return (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="min-w-0">
                <div className="text-base font-semibold">{item.title}</div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                  {item.year ? <span>{item.year}</span> : null}
                  {item.level ? <span>{item.level}</span> : null}
                  {(item.tags ?? []).map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              </div>

              {isJobAgentDashboard ? (
                <div className="inline-grid grid-cols-2 items-center justify-items-end gap-2">
                  <Link
                    href="/applications/job-agent/public/jobs"
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Public
                  </Link>
                  <Link
                    href="/applications/job-agent/admin/jobs"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    Admin
                  </Link>
                </div>
              ) : isInternalLink ? (
                <Link
                  href={item.pdfPath}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Open
                </Link>
              ) : (
                <a
                  href={item.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Open
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
