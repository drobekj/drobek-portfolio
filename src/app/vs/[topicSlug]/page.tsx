import { notFound } from "next/navigation";
import { repo } from "@/lib/data/localRepository";

export default async function VSTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;

  const topic = await repo.getTopic("vs", topicSlug);
  if (!topic) return notFound();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{topic.title}</h1>
          {topic.description ? (
            <p className="mt-2 text-sm text-gray-500">{topic.description}</p>
          ) : null}
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {topic.items.length} PDF
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {topic.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{item.title}</div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                {item.year ? <span>{item.year}</span> : null}
                {item.type ? <span>{item.type}</span> : null}
                {item.level ? <span>{item.level}</span> : null}
                {(item.tags ?? []).map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            </div>

            <a
              href={item.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:opacity-80"
            >
              Otevřít PDF
            </a>
          </div>
        ))}

        {!topic.items.length ? (
          <div className="rounded-2xl border bg-white p-5 text-sm text-gray-500">
            Zatím zde nejsou žádné materiály.
          </div>
        ) : null}
      </div>
    </div>
  );
}