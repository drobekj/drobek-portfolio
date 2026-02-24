const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "public", "pdfs");

function prettifyName(filename) {
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const TITLES = {
  ss: {
    mnoziny: "Množiny",
    vyrazy: "Výrazy",
    rovnice_a_nerovnice: "Rovnice a nerovnice",
    funkce: "Funkce",
    planimetrie: "Planimetrie",
    stereometrie: "Stereometrie",
    analyticka_geometrie: "Analytická geometrie",
    posloupnosti: "Posloupnosti",
    financni_matematika: "Finanční matematika",
    kombinatorika: "Kombinatorika",
  },
  vs: {
    opakovani_zakladu_matematiky: "Opakování základů matematiky",
    diferencialni_pocet: "Diferenciální počet",
    linearni_algebra: "Lineární algebra",
    analyticka_geometrie: "Analytická geometrie",
    integralni_pocet: "Integrální počet",
    diferencialni_pocet_dvou_promennych:
      "Diferenciální počet funkce dvou proměnných",
    obycejne_diferencialni_rovnice: "Obyčejné diferenciální rovnice",
  },
};

function readExisting(section) {
  const p = path.join(__dirname, "src", "content", `${section}.json`);
  if (!fs.existsSync(p)) return { topics: [] };
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return { topics: [] };
  }
}

function writeOutput(section, output) {
  const outPath = path.join(__dirname, "src", "content", `${section}.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Generated ${section}.json`);
}

function generateSection(section) {
  const sectionPath = path.join(baseDir, section);
  if (!fs.existsSync(sectionPath)) return;

  const existing = readExisting(section);

  // topicSlug -> topicObject
  const existingTopics = new Map(
    (existing.topics || []).map((t) => [t.slug, t])
  );

  const topicSlugs = fs.readdirSync(sectionPath);

  const output = { topics: [] };

  for (const topicSlug of topicSlugs) {
    const topicPath = path.join(sectionPath, topicSlug);
    if (!fs.statSync(topicPath).isDirectory()) continue;

    const files = fs
      .readdirSync(topicPath)
      .filter((f) => f.toLowerCase().endsWith(".pdf"))
      .sort((a, b) => a.localeCompare(b));

    const prevTopic = existingTopics.get(topicSlug);

    // pdfPath -> itemObject (abychom zachovali ruční úpravy)
    const prevItemsByPath = new Map(
      ((prevTopic && prevTopic.items) || []).map((it) => [it.pdfPath, it])
    );

    const items = files.map((file, i) => {
      const pdfPath = `/pdfs/${section}/${topicSlug}/${file}`;
      const fallback = {
  id: `${section}_${topicSlug}_${i + 1}`,
  title: prettifyName(file),
  pdfPath,
  type: "slides",
  year: null,
  level: null,
  tags: [],
};

const prev = prevItemsByPath.get(pdfPath);

return prev ? normalizeItem(prev, fallback) : fallback;
    });

    output.topics.push({
      slug: topicSlug,
      title:
        (prevTopic && prevTopic.title) ||
        (TITLES[section] && TITLES[section][topicSlug]) ||
        prettifyName(topicSlug),
      description: prevTopic?.description,
      tags: prevTopic?.tags,
      items,
    });
  }

  writeOutput(section, output);

function normalizeItem(item, fallback) {
  return {
    ...fallback,
    ...item,
    type: item.type ?? fallback.type,
    year: item.year ?? fallback.year,
    level: item.level ?? fallback.level,
    tags: item.tags ?? fallback.tags,
  };
}
}

generateSection("ss");
generateSection("vs");