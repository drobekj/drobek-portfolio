import { PDF_TITLE_OVERRIDES } from "@/lib/uiLabels";

type PdfItem = {
  id: string;
  title: string;
  pdfPath: string;
  type?: string | null;
  year?: string | number | null;
  level?: string | null;
  tags?: string[] | null;
};

export type PdfVariant = {
  base: PdfItem;
  step?: PdfItem | null;
};

export type GroupedTopicPdfs = {
  overview: PdfVariant | null;
  groups: PdfVariant[];
};

/**
 * VS pořadí prezentací uvnitř konkrétního okruhu (topic slug).
 * Klíče jsou "baseName" z pdfPath: např. /.../limita_pr_bm1_hgf.pdf -> "limita_pr_bm1_hgf"
 * Pozn.: referáty se řadí zvlášť jako overview, takže je sem dávat nemusíme.
 */
const VS_ITEM_ORDER: Record<string, string[]> = {
  // Diferenciální počet I
  diferencialni_pocet_i: [
    "uvod_pr_bm1_hgf",
    "funkce_pr_bm1_hgf",
    "limita_pr_bm1_hgf",
    "limity_na_3_slajdy",
    "spojitost_pr_bm1_hgf",
    "derivace_pr_bm1_hgf",
    "vyuzitider_pr_bm1_hgf",
    "extremalni_pr_bm1_hgf",
  ],

  // Lineární algebra
  linearni_algebra: [
    "vektory_pr_bm1_hgf",
    "matice_pr_bm1_hgf",
    "soustavy_pr_bm1_hgf",
  ],

  // Analytická geometrie
  analyticka_geometrie: [
    "primkarovina_pr_bm1_hgf",
    "polohove_pr_bm1_hgf",
  ],

  // okruhy integralni_pocet / diferencialni_pocet_ii / obycejne_diferencialni_rovnice
  // mají zatím jen referát => groups bude prázdné, není co řadit
};

const SS_ITEM_ORDER: Record<string, string[]> = {
  mnoziny: ["m1_mnoziny_zakladni_goa"],
  vyrazy: ["m1_vyrazy_lomene_goa"],

  rovnice_a_nerovnice: [
    "m1_rovnice_linearni_goa",
    "m1_rovnice_nerovnice_goa",
    "m1_rovnice_soustavy_goa",
    "m1_rovnice_absolut_goa",
    "m1_rovnice_kvadraticka_goa",
  ],

  funkce: [
    "m2_funkce_zakladni_goa",
    // linearni + lomene v LaTeXu jsou označené jako "chybi" -> nejsou v PDF, takže je sem nedáváme
    "m2_funkce_kvadraticka_goa",
    "m2_funkce_iracionalni_goa",
    "m2_funkce_exponencialni_goa",
    "m2_funkce_logaritmicke_goa",
    "m2_funkce_goniometricke_goa",
    "m2_trigonometrie_goa",
  ],

  planimetrie: [
    "m2_planimetrie_zakladni_goa",
    "m2_planimetrie_podobnost_goa",
    "m2_planimetrie_vety_goa",
    "m2_planimetrie_shodna_goa",
  ],

  stereometrie: [
    "m3_stereometrie_zakladni_goa",
    "m3_stereometrie_polohove_goa",
    "m3_stereometrie_volnerov_goa",
    "m3_stereometrie_metricke_goa",
    "m3_stereometrie_rezy_goa",
  ],

  analyticka_geometrie: [
    "m3_analgeom_vektory_goa",
    "m3_analgeom_primka_goa",
    "m3_analgeom_polohove_goa",
    "m3_analgeom_metricke_goa",
    "m3_analgeom_rovina_goa",
    "m3_analgeom_kuzelosecky_goa",
    "m3_analgeom_kruznice_goa",
    "m3_analgeom_kruznice_priklady_goa",
    "m3_analgeom_elipsa_goa",
    "m3_analgeom_elipsa_priklady_goa",
    "m3_analgeom_hyperbola_priklady_goa",
    "m3_analgeom_parabola_goa",
    "m3_analgeom_parabola_priklady_goa",
  ],

  posloupnosti: [
    "m3_posloupnosti_zakladni_goa",
    "m3_posloupnosti_aritm_goa",
    "m3_posloupnosti_geom_goa",
  ],

  financni_matematika: ["m3_financni_zakladni_goa"],

  kombinatorika: [
    "m3_kombin_faktorial_goa",
    "m3_kombin_cisla_goa",
    "m3_kombin_pravidla_goa",
    "m3_kombin_bezopak_goa",
    "m3_kombin_sopak_goa",
  ],
};

function fileBaseNameFromPdfPath(pdfPath: string) {
  const last = pdfPath.split("/").pop() ?? pdfPath;
  const noExt = last.replace(/\.pdf$/i, "");
  return noExt.replace(/_klik$/i, "");
}

function applyTitleOverride(item: PdfItem): PdfItem {
  const key = fileBaseNameFromPdfPath(item.pdfPath);
  const override = PDF_TITLE_OVERRIDES[key];
  return override ? { ...item, title: override } : item;
}

function isStepVariant(item: PdfItem) {
  return /_klik\.pdf$/i.test(item.pdfPath);
}

function isOverview(item: PdfItem) {
  // referát/referat - tolerujeme diakritiku v title, ale rozhodujeme podle pdfPath
  return /\/referat_[^/]+\.pdf$/i.test(item.pdfPath);
}

function buildOrderIndex(order: string[]) {
  const m = new Map<string, number>();
  order.forEach((k, i) => m.set(k, i));
  return m;
}

/**
 * Group PDFs into overview (referat) and presentation groups with optional step variant.
 * @param items topic.items
 * @param topicSlug optional slug, used for deterministic ordering (VS)
 */
export function groupTopicPdfs(items: PdfItem[], topicSlug?: string): GroupedTopicPdfs {
  const byKey = new Map<string, { base?: PdfItem; step?: PdfItem }>();
  let overviewBase: PdfItem | undefined;
  let overviewStep: PdfItem | undefined;

  for (const item of items) {
    const normalizedItem = applyTitleOverride(item);
    const baseKey = fileBaseNameFromPdfPath(normalizedItem.pdfPath);

    if (isOverview(normalizedItem)) {
      if (isStepVariant(normalizedItem)) overviewStep = normalizedItem;
      else overviewBase = normalizedItem;
      continue;
    }

    const entry = byKey.get(baseKey) ?? {};
    if (isStepVariant(normalizedItem)) entry.step = normalizedItem;
    else entry.base = normalizedItem;
    byKey.set(baseKey, entry);
  }

  const groups: PdfVariant[] = [];
  for (const [_, entry] of byKey.entries()) {
    if (!entry.base) {
      // pokud by někdy existovala jen kroková varianta, uděláme ji "base"
      // (tlačítka v UI stále fungují, jen bude jediný odkaz)
      if (entry.step) groups.push({ base: entry.step });
      continue;
    }
    groups.push({ base: entry.base, step: entry.step ?? null });
  }

  // ---- ŘAZENÍ ----
  // 1) Pokud je VS a máme pro topicSlug mapu, použij ji
  const isSs = items.some((it) => it.pdfPath.includes("/pdfs/ss/"));
const orderList = topicSlug
  ? isSs
    ? SS_ITEM_ORDER[topicSlug]
    : VS_ITEM_ORDER[topicSlug]
  : undefined;
  if (orderList && orderList.length) {
    const idx = buildOrderIndex(orderList);

    groups.sort((a, b) => {
      const ak = fileBaseNameFromPdfPath(a.base.pdfPath);
      const bk = fileBaseNameFromPdfPath(b.base.pdfPath);
      const ai = idx.get(ak);
      const bi = idx.get(bk);

      // známé položky dopředu ve správném pořadí
      if (ai != null && bi != null) return ai - bi;
      if (ai != null) return -1;
      if (bi != null) return 1;

      // neznámé položky stabilně podle title/pdfPath
      const at = (a.base.title ?? "").localeCompare(b.base.title ?? "", "cs");
      if (at !== 0) return at;
      return a.base.pdfPath.localeCompare(b.base.pdfPath);
    });
  } else {
    // 2) fallback: stabilní abecední
    groups.sort((a, b) => {
      const at = (a.base.title ?? "").localeCompare(b.base.title ?? "", "cs");
      if (at !== 0) return at;
      return a.base.pdfPath.localeCompare(b.base.pdfPath);
    });
  }

  const overview: PdfVariant | null =
    overviewBase || overviewStep
      ? {
          base: (overviewBase ?? overviewStep!) as PdfItem,
          step: overviewBase && overviewStep ? overviewStep : null,
        }
      : null;

  return { overview, groups };
}