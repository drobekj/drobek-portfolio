import type { Catalog, SectionKey, Topic } from "./types";
import type { DataRepository } from "./repository";

import ss from "@/content/ss.json";
import vs from "@/content/vs.json";
import research from "@/content/research.json";
import insurance from "@/content/insurance.json";

const catalogs: Record<SectionKey, Catalog> = {
  ss: ss as Catalog,
  vs: vs as Catalog,
  research: research as Catalog,
  insurance: insurance as Catalog,
};

export class LocalRepository implements DataRepository {
  async getCatalog(section: SectionKey): Promise<Catalog> {
    return catalogs[section];
  }

  async getTopic(section: SectionKey, slug: string): Promise<Topic | null> {
    const cat = catalogs[section];
    return cat.topics.find((t) => t.slug === slug) ?? null;
  }
}

export const repo = new LocalRepository();