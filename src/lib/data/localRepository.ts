import type { Catalog, SectionKey, Topic } from "./types";
import type { DataRepository } from "./repository";

import ss from "@/content/ss.json";
import vs from "@/content/vs.json";
import research from "@/content/research.json";
import insurance from "@/content/insurance.json";
import {
  SS_TOPIC_TITLES,
  VS_TOPIC_TITLES,
} from "@/lib/uiLabels";

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

const VS_TOPIC_ORDER = [
  "zaklady_matematiky",
  "diferencialni_pocet_i",
  "linearni_algebra",
  "analyticka_geometrie",
  "integralni_pocet",
  "diferencialni_pocet_ii",
  "obycejne_diferencialni_rovnice",
] as const;

const INSURANCE_TOPIC_ORDER = [
  "insurance_frequency_modeling",
] as const;

const ssTopicOrderIndex = new Map<string, number>(
  SS_TOPIC_ORDER.map((slug, idx) => [slug, idx])
);

const vsTopicOrderIndex = new Map<string, number>(
  VS_TOPIC_ORDER.map((slug, idx) => [slug, idx])
);

const insuranceTopicOrderIndex = new Map<string, number>(
  INSURANCE_TOPIC_ORDER.map((slug, idx) => [slug, idx])
);

function sortTopicsByOrder<T extends { slug: string }>(
  topics: T[],
  orderIndex: Map<string, number>
) {
  return [...topics].sort((a, b) => {
    const ai = orderIndex.get(a.slug);
    const bi = orderIndex.get(b.slug);

    if (ai != null && bi != null) return ai - bi;
    if (ai != null) return -1;
    if (bi != null) return 1;

    return a.slug.localeCompare(b.slug, "cs");
  });
}

function applyTitleOverride(section: SectionKey, topic: Topic): Topic {
  const titleOverride =
    section === "ss"
      ? SS_TOPIC_TITLES[topic.slug]
      : section === "vs"
        ? VS_TOPIC_TITLES[topic.slug]
        : undefined;

  return titleOverride ? { ...topic, title: titleOverride } : topic;
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

    const topicsWithTitleOverrides = catalog.topics.map((topic) =>
      applyTitleOverride(section, topic)
    );

    if (section === "ss") {
      return {
        ...catalog,
        topics: sortTopicsByOrder(topicsWithTitleOverrides, ssTopicOrderIndex),
      };
    }

    if (section === "vs") {
      return {
        ...catalog,
        topics: sortTopicsByOrder(topicsWithTitleOverrides, vsTopicOrderIndex),
      };
    }

    if (section === "insurance") {
      return {
        ...catalog,
        topics: sortTopicsByOrder(
          topicsWithTitleOverrides,
          insuranceTopicOrderIndex
        ),
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

    return applyTitleOverride(section, topic);
  }
}

export const repo = new LocalRepository();