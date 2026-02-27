import type { Catalog, SectionKey, Topic } from "./types";
import type { DataRepository } from "./repository";

import ss from "@/content/ss.json";
import vs from "@/content/vs.json";
import research from "@/content/research.json";
import insurance from "@/content/insurance.json";
import { SS_TOPIC_TITLES, VS_TOPIC_TITLES } from "@/lib/uiLabels";

const SS_TOPIC_ORDER = [
  "mnoziny",
  "vyrazy",
  "rovnice_a_nerovnice",
  "funkce",
  "planimetrie",
  "stereometrie",
  "analyticka_geometrie",
  "posloupnosti",
  "financni_matematika",
  "kombinatorika",
] as const;

const ssTopicOrderIndex = new Map<string, number>(
  SS_TOPIC_ORDER.map((slug, idx) => [slug, idx])
);

function sortSsTopics<T extends { slug: string }>(topics: T[]) {
  return [...topics].sort((a, b) => {
    const ai = ssTopicOrderIndex.get(a.slug);
    const bi = ssTopicOrderIndex.get(b.slug);

    if (ai != null && bi != null) return ai - bi;
    if (ai != null) return -1;
    if (bi != null) return 1;

    return a.slug.localeCompare(b.slug, "cs");
  });
}

const VS_TOPIC_ORDER = [
  "zaklady_matematiky",
  "diferencialni_pocet_i",
  "linearni_algebra",
  "analyticka_geometrie",
  "integralni_pocet",
  "diferencialni_pocet_ii",
  "obycejne_diferencialni_rovnice",
] as const;

const vsTopicOrderIndex = new Map<string, number>(
  VS_TOPIC_ORDER.map((slug, idx) => [slug, idx])
);

function sortVsTopics<T extends { slug: string }>(topics: T[]) {
  return [...topics].sort((a, b) => {
    const ai = vsTopicOrderIndex.get(a.slug);
    const bi = vsTopicOrderIndex.get(b.slug);

    if (ai != null && bi != null) return ai - bi;
    if (ai != null) return -1;
    if (bi != null) return 1;

    return a.slug.localeCompare(b.slug, "cs");
  });
}

const catalogs: Record<SectionKey, Catalog> = {
  ss: ss as Catalog,
  vs: vs as Catalog,
  research: research as Catalog,
  insurance: insurance as Catalog,
};

export class LocalRepository implements DataRepository {
async getCatalog(section: SectionKey): Promise<Catalog> {
  const catalog = catalogs[section];

  const topicsWithTitleOverrides = catalog.topics.map((t) => {
    const titleOverride =
      section === "ss"
        ? SS_TOPIC_TITLES[t.slug]
        : section === "vs"
          ? VS_TOPIC_TITLES[t.slug]
          : undefined;

    return titleOverride ? { ...t, title: titleOverride } : t;
  });

  if (section === "ss") {
    return {
      ...catalog,
      topics: sortSsTopics(topicsWithTitleOverrides),
    };
  }

  if (section === "vs") {
    return {
      ...catalog,
      topics: sortVsTopics(topicsWithTitleOverrides),
    };
  }

  return {
    ...catalog,
    topics: topicsWithTitleOverrides,
  };
}

async getTopic(section: SectionKey, slug: string): Promise<Topic | null> {
  const catalog = catalogs[section];
  const topic = catalog.topics.find((t) => t.slug === slug);
  if (!topic) return null;

  const titleOverride =
    section === "ss"
      ? SS_TOPIC_TITLES[topic.slug]
      : section === "vs"
        ? VS_TOPIC_TITLES[topic.slug]
        : undefined;

  return titleOverride ? { ...topic, title: titleOverride } : topic;
}
}

export const repo = new LocalRepository();