import { notFound } from "next/navigation";
import { repo } from "@/lib/data/localRepository";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { groupTopicPdfs } from "@/lib/pdfGrouping";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("vs", topicSlug);
  if (!topic) return { title: "VŠ learning" };
  return { title: `${topic.title} (VŠ)` };
}

export default async function VSTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;

  const topic = await repo.getTopic("vs", topicSlug);
  if (!topic) return notFound();

  const { overview, groups } = groupTopicPdfs(topic.items);

  return (
    <div>
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/vs", label: "VŠ learning" },
          { href: `/vs/${topic.slug}`, label: topic.title },
        ]}
      />

      {/* ===== HLAVIČKA ===== */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {topic.title}
          </h1>
          {topic.description ? (
            <p className="mt-2 text-sm text-gray-500">
              {topic.description}
            </p>
          ) : null}
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {topic.items.length} PDF
        </div>
      </div>

      {/* ===== LEGENDA ===== */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
        <span className="rounded-full border bg-white px-2 py-1">
          <span className="font-semibold">Otevřít</span> = přepínání po slidech
        </span>

        <span className="rounded-full border bg-white px-2 py-1">
          <span className="font-semibold">Krokově</span> = postupné kroky v rámci slidů
        </span>

        {overview ? (
          <span className="rounded-full border bg-white px-2 py-1">
            <span className="font-semibold">Přehled okruhu</span> = zhuštěné shrnutí sekce
          </span>
        ) : null}
      </div>

      <div className="mt-10 space-y-8">
        {/* ===== OVERVIEW (pokud existuje) ===== */}
        {overview ? (
          <div className="rounded-2xl border-2 border-gray-300 bg-gray-50 p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-lg font-semibold">
                  {overview.base.title}
                </div>
                <div className="mt-2 pl-2.5 text-sm font-medium text-gray-500">
                  Přehled okruhu
                </div>
              </div>

              {/* Pravý panel: [Krokově] [Otevřít] */}
              <div className="inline-grid grid-cols-2 items-center justify-items-end gap-2">
                {overview.step ? (
                  <a
                    href={overview.step.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Krokově
                  </a>
                ) : (
                  <span className="invisible rounded-xl border px-4 py-2 text-sm font-medium">
                    Krokově
                  </span>
                )}

                <a
                  href={overview.base.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Otevřít
                </a>
              </div>
            </div>
          </div>
        ) : null}

        {/* ===== PREZENTACE ===== */}
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.base.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="min-w-0">
                <div className="truncate text-base font-semibold">
                  {group.base.title}
                </div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                  {group.base.year ? <span>{group.base.year}</span> : null}
                  {group.base.level ? <span>{group.base.level}</span> : null}
                  {(group.base.tags ?? []).map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>

              {/* Pravý panel: [Krokově] [Otevřít] */}
              <div className="inline-grid grid-cols-2 items-center justify-items-end gap-2">
                {group.step ? (
                  <a
                    href={group.step.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Krokově
                  </a>
                ) : (
                  <span className="invisible rounded-xl border px-4 py-2 text-sm font-medium">
                    Krokově
                  </span>
                )}

                <a
                  href={group.base.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Otevřít
                </a>
              </div>
            </div>
          ))}

          {!groups.length ? (
            <div className="rounded-2xl border bg-white p-5 text-sm text-gray-500">
              Zatím zde nejsou žádné materiály.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}