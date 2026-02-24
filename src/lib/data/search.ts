import { repo } from "./localRepository";
import type { MaterialItem, SectionKey } from "./types";

export type SearchResult = MaterialItem & {
  section: SectionKey;
  topicSlug: string;
  topicTitle: string;
};

const sections: SectionKey[] = ["ss", "vs"];

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const q = query.toLowerCase();

  const results: SearchResult[] = [];

  for (const section of sections) {
    const catalog = await repo.getCatalog(section);

    for (const topic of catalog.topics) {
      for (const item of topic.items) {
        const haystack = [
          item.title,
          ...(item.tags ?? []),
          item.year?.toString() ?? "",
          item.type ?? "",
          item.level ?? "",
        ]
          .join(" ")
          .toLowerCase();

        if (haystack.includes(q)) {
          results.push({
            ...item,
            section,
            topicSlug: topic.slug,
            topicTitle: topic.title,
          });
        }
      }
    }
  }

  return results;
}