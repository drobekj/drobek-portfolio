"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import ss from "@/content/ss.json";
import vs from "@/content/vs.json";
import insurance from "@/content/insurance.json";
import research from "@/content/research.json";
import mlDs from "@/content/ml-ds.json";
import applications from "@/content/applications.json";

type SectionKey = "ss" | "vs" | "insurance" | "research" | "ml-ds" | "applications";

type SearchResult = {
  id: string;
  title: string;
  href: string;
  tags?: string[];
  type?: string;
  year?: number | string;
  level?: string;
  summary?: string;
  topicTitle?: string;
  section: SectionKey;
  sectionLabel: string;
};

type StudyCatalog = {
  topics?: Array<{
    slug: string;
    title: string;
    description?: string;
    summary?: string;
    items?: Array<{
      id: string;
      title: string;
      tags?: string[];
      type?: string;
      year?: number | null;
      level?: string | null;
    }>;
  }>;
};

type InsuranceCatalog = {
  topics?: Array<{
    slug: string;
    title: string;
    keywords?: string[];
    tools?: string[];
    summary?: string;
    keyContribution?: string;
  }>;
};

type ResearchCatalog = {
  topics?: Array<{
    slug: string;
    title: string;
    keywords?: string[];
    journal?: string;
    year?: number | string;
    authors?: string;
    summary?: string;
    keyContribution?: string;
  }>;
};

type ProjectCatalog = {
  topics?: Array<{
    slug: string;
    title: string;
    description?: string;
    summary?: string;
    items?: Array<{
      title: string;
      tags?: string[];
    }>;
  }>;
};

function getSectionLabel(section: SectionKey) {
  switch (section) {
    case "ss":
      return "High School";
    case "vs":
      return "University";
    case "insurance":
      return "Insurance";
    case "research":
      return "Research";
    case "ml-ds":
      return "ML/DS";
    case "applications":
      return "Applications";
  }
}

function uniqueStrings(values: string[] | undefined) {
  return [...new Set((values ?? []).filter(Boolean))];
}

function buildIndex(): SearchResult[] {
  const out: SearchResult[] = [];

  const addStudyCatalog = (
    section: "ss" | "vs",
    catalog: StudyCatalog
  ) => {
    for (const topic of catalog.topics ?? []) {
      for (const item of topic.items ?? []) {
        out.push({
          id: item.id,
          title: item.title,
          href: `/${section}/${topic.slug}`,
          tags: uniqueStrings(item.tags),
          type: item.type,
          year: item.year ?? undefined,
          level: item.level ?? undefined,
          summary: topic.description ?? topic.summary,
          topicTitle: topic.title,
          section,
          sectionLabel: getSectionLabel(section),
        });
      }
    }
  };

  const addInsuranceCatalog = (catalog: InsuranceCatalog) => {
    for (const topic of catalog.topics ?? []) {
      out.push({
        id: topic.slug,
        title: topic.title,
        href: `/insurance/${topic.slug}`,
        tags: uniqueStrings([...(topic.keywords ?? []), ...(topic.tools ?? [])]),
        summary: topic.summary ?? topic.keyContribution,
        topicTitle: topic.title,
        section: "insurance",
        sectionLabel: getSectionLabel("insurance"),
      });
    }
  };

  const addResearchCatalog = (catalog: ResearchCatalog) => {
    for (const topic of catalog.topics ?? []) {
      out.push({
        id: topic.slug,
        title: topic.title,
        href: `/research/${topic.slug}`,
        tags: uniqueStrings(topic.keywords),
        type: topic.journal,
        year: topic.year,
        level: topic.authors,
        summary: topic.summary ?? topic.keyContribution,
        topicTitle: topic.title,
        section: "research",
        sectionLabel: getSectionLabel("research"),
      });
    }
  };

  const addProjectCatalog = (
    section: "ml-ds" | "applications",
    catalog: ProjectCatalog
  ) => {
    for (const topic of catalog.topics ?? []) {
      const itemTags = (topic.items ?? []).flatMap((item) => item.tags ?? []);
      const itemTitles = (topic.items ?? []).map((item) => item.title).join(" ");

      out.push({
        id: topic.slug,
        title: topic.title,
        href: `/${section}/${topic.slug}`,
        tags: uniqueStrings(itemTags),
        summary: topic.description ?? topic.summary,
        level: itemTitles,
        topicTitle: topic.title,
        section,
        sectionLabel: getSectionLabel(section),
      });
    }
  };

  addStudyCatalog("ss", ss);
  addStudyCatalog("vs", vs);
  addInsuranceCatalog(insurance);
  addResearchCatalog(research);
  addProjectCatalog("ml-ds", mlDs);
  addProjectCatalog("applications", applications);

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
          r.section,
          r.sectionLabel,
          r.topicTitle ?? "",
          r.summary ?? "",
          (r.tags ?? []).join(" "),
          r.type ?? "",
          r.year?.toString() ?? "",
          r.level ?? "",
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
        placeholder="Search... (e.g. insurance, dissertation, equations, xgboost)"
        className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring"
      />

      {!q.trim() ? (
        <div className="text-sm text-gray-500">Start typing to search.</div>
      ) : results.length ? (
        <div className="space-y-3">
          {results.map((r) => (
            <div
              key={`${r.section}-${r.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold">{r.title}</div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                  <Link href={r.href} className="hover:underline">
                    {r.sectionLabel}
                    {r.topicTitle && r.topicTitle !== r.title ? `: ${r.topicTitle}` : ""}
                  </Link>

                  {r.year ? <span>{r.year}</span> : null}
                  {r.type ? <span>{r.type}</span> : null}
                  {(r.tags ?? []).slice(0, 6).map((t, i) => (
                    <span key={`${r.id}-${t}-${i}`}>#{t}</span>
                  ))}
                </div>

                {r.summary ? (
                  <div className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {r.summary}
                  </div>
                ) : null}
              </div>

              <Link
                href={r.href}
                className="shrink-0 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Open
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No results found.</div>
      )}
    </div>
  );
}
