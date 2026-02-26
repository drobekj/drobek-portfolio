// src/lib/pdfGrouping.ts

export type PdfType = "slides" | "worksheet" | "test" | "notes" | "other";

export type PdfItem = {
  id: string;
  title: string;
  pdfPath: string; // merge key, e.g. "/pdfs/vs/diferencialni_pocet_i/limita_pr_bm1_hgf.pdf"
  type?: PdfType;
  year?: number | null;
  level?: "easy" | "medium" | "hard" | null;
  tags?: string[];
};

export type PdfVariant = {
  base: PdfItem;
  step?: PdfItem; // *_klik.pdf
};

export type PdfGroupedView = {
  overview?: PdfVariant; // referat_*.pdf (+ optional *_klik)
  groups: PdfVariant[];  // regular presentations grouped by base/step
};

function getFileName(pdfPath: string): string {
  const parts = pdfPath.split("/");
  return parts[parts.length - 1] ?? pdfPath;
}

function isStepVariant(pdfPath: string): boolean {
  return pdfPath.toLowerCase().endsWith("_klik.pdf");
}

function baseKeyFromPath(pdfPath: string): string {
  // Normalize "_klik.pdf" -> ".pdf" so base + step share a key
  const lower = pdfPath.toLowerCase();
  if (lower.endsWith("_klik.pdf")) {
    return pdfPath.slice(0, -"_klik.pdf".length) + ".pdf";
  }
  return pdfPath;
}

function isOverviewFile(pdfPath: string): boolean {
  // overview/referat is identified by filename prefix "referat_"
  const name = getFileName(pdfPath).toLowerCase();
  return name.startsWith("referat_");
}

export function groupTopicPdfs(items: PdfItem[]): PdfGroupedView {
  const byKey = new Map<string, { base?: PdfItem; step?: PdfItem }>();

  for (const item of items) {
    const key = baseKeyFromPath(item.pdfPath);
    const entry = byKey.get(key) ?? {};
    if (isStepVariant(item.pdfPath)) entry.step = item;
    else entry.base = item;
    byKey.set(key, entry);
  }

  let overview: PdfVariant | undefined;
  const groups: PdfVariant[] = [];

  for (const [key, entry] of byKey.entries()) {
    // If we only have a step pdf without base, treat step as base fallback
    const base = entry.base ?? entry.step;
    if (!base) continue;

    const variant: PdfVariant = {
      base,
      step: entry.base ? entry.step : undefined, // only keep step if base exists
    };

    if (isOverviewFile(key)) {
      // "referat_*.pdf" goes to overview
      overview = variant;
    } else {
      groups.push(variant);
    }
  }

  // Deterministic order: by title, then pdfPath
  groups.sort((a, b) => {
    const at = (a.base.title ?? "").localeCompare(b.base.title ?? "", "cs");
    if (at !== 0) return at;
    return a.base.pdfPath.localeCompare(b.base.pdfPath);
  });

  return { overview, groups };
}