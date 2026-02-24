const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "public", "pdfs");

function prettifyName(filename) {
  return filename
    .replace(".pdf", "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function generateSection(section) {
  const sectionPath = path.join(baseDir, section);
  if (!fs.existsSync(sectionPath)) return;

  const topics = fs.readdirSync(sectionPath);

  const output = {
    topics: [],
  };

  for (const topic of topics) {
    const topicPath = path.join(sectionPath, topic);
    if (!fs.statSync(topicPath).isDirectory()) continue;

    const files = fs
      .readdirSync(topicPath)
      .filter((f) => f.endsWith(".pdf"));

    const items = files.map((file, i) => ({
      id: `${section}_${topic}_${i + 1}`,
      title: prettifyName(file),
      pdfPath: `/pdfs/${section}/${topic}/${file}`,
    }));

    output.topics.push({
      slug: topic,
      title: prettifyName(topic),
      items,
    });
  }

  const outPath = path.join(
    __dirname,
    "src",
    "content",
    `${section}.json`
  );

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Generated ${section}.json`);
}

generateSection("ss");
generateSection("vs");