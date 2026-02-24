"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import ss from "@/content/ss.json";
import vs from "@/content/vs.json";

type SectionKey = "ss" | "vs";

type SearchResult = {
  id: string;
  title: string;
  pdfPath: string;
  tags?: string[];
  type?: string;
  year?: number;
  level?: string;

  section: SectionKey;
  topicSlug: string;
  topicTitle: string;
};

function buildIndex(): SearchResult[] {
  const out: SearchResult[] = [];

  const add = (section: SectionKey, catalog: any) => {
    for (const topic of catalog.topics ?? []) {
      for (const item of topic.items ?? []) {
        out.push({
          ...item,
          section,
          topicSlug: topic.slug,
          topicTitle: topic.title,
        });
      }
    }
  };

  add("ss", ss as any);
  add("vs", vs as any);

  return out;
}

export function SearchClient() {
  const [q, setQ] = useState("");

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    const nq = q.trim().toLowerCase();
    if (!nq) return [];

    return index
      .filter((r) => {
        const hay = [
          r.title,
          (r.tags ?? []).join(" "),
          r.type ?? "",
          r.year?.toString() ?? "",
          r.level ?? "",
          r.topicTitle,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(nq);
      })
      .slice(0, 50);
  }, [q, index]);

  return (
    <div className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Hledat… (např. rovnice, maturita, 2026)"
        className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring"
      />

      {!q.trim() ? (
        <div className="text-sm text-gray-500">Začni psát dotaz.</div>
      ) : results.length ? (
        <div className="space-y-3">
          {results.map((r) => (
            <div
              key={`${r.section}-${r.topicSlug}-${r.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold">{r.title}</div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                  <Link
                    href={`/${r.section}/${r.topicSlug}`}
                    className="hover:underline"
                  >
                    {r.section.toUpperCase()}: {r.topicTitle}
                  </Link>
                  {r.year ? <span>{r.year}</span> : null}
                  {r.type ? <span>{r.type}</span> : null}
                  {(r.tags ?? []).map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>

              <a
                href={r.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl border bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                PDF
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Nic nenalezeno.</div>
      )}
    </div>
  );
}