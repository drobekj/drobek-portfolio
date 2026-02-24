import type { Catalog, SectionKey, Topic } from "./types";

export interface DataRepository {
  getCatalog(section: SectionKey): Promise<Catalog>;
  getTopic(section: SectionKey, slug: string): Promise<Topic | null>;
}