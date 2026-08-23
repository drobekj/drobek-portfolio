import { repo } from "@/lib/data/localRepository";

const baseUrl = "https://drobek-portfolio.vercel.app"; // uprav pokud je jiná

export default async function sitemap() {
  const routes = [
    "",
    "/ss",
    "/vs",
    "/research",
    "/insurance",
    "/ml-ds",
    "/search",
  ];

  const urls = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const sections: ("ss" | "vs" | "ml-ds")[] = ["ss", "vs", "ml-ds"];

  for (const section of sections) {
    const catalog = await repo.getCatalog(section);
    for (const topic of catalog.topics) {
      urls.push({
        url: `${baseUrl}/${section}/${topic.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return urls;
}
