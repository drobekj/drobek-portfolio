import { notFound } from "next/navigation";
import { repo } from "@/lib/data/localRepository";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("ml-ds", topicSlug);

  if (!topic) {
    return { title: "ML/DS" };
  }

  return { title: topic.title };
}

export default async function MlDsTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await repo.getTopic("ml-ds", topicSlug);

  if (!topic) {
    return notFound();
  }

  const pdfCZ = topic.items.find((item) => item.id.includes("_pdf_cz"));
  const pdfEN = topic.items.find((item) => item.id.includes("_pdf_en"));
  const githubItems = topic.items.filter((item) =>
    item.id.includes("_github")
  );

  return (
    <div>
      <Breadcrumbs
        items={[
          { href: "/ml-ds", label: "ML/DS" },
          { href: `/ml-ds/${topic.slug}`, label: topic.title },
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
          {topic.items.length}{" "}
          {topic.items.length === 1
            ? "item"
            : topic.items.length >= 2 && topic.items.length <= 4
            ? "items"
            : "items"}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {(pdfCZ || pdfEN) && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="min-w-0">
              <div className="text-base font-semibold">Case Study PDF</div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                <span>Portfolio case study</span>
                <span>#PDF</span>
                <span>#MLDS</span>
              </div>
            </div>

            <div className="inline-grid grid-cols-2 items-center justify-items-end gap-2">
              {pdfEN ? (
                <a
                  href={pdfEN.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  EN
                </a>
              ) : (
                <span className="invisible rounded-xl border px-4 py-2 text-sm font-medium">
                  EN
                </span>
              )}

              {pdfCZ ? (
                <a
                  href={pdfCZ.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  CZ
                </a>
              ) : (
                <span className="invisible rounded-xl border px-4 py-2 text-sm font-medium">
                  CZ
                </span>
              )}
            </div>
          </div>
        )}

        {githubItems.map((item) => (
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

            <a
              href={item.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Open
            </a>
          </div>
        ))}

        {!pdfCZ && !pdfEN && githubItems.length === 0 && (
          <div className="rounded-2xl border bg-white p-5 text-sm text-gray-500">
            Zatím zde nejsou žádné projekty.
          </div>
        )}
      </div>
    </div>
  );
}