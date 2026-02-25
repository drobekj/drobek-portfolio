export type Level = "easy" | "medium" | "hard";
export type MaterialType = "slides" | "worksheet" | "test" | "notes" | "other";

export type MaterialItem = {
  id: string;
  title: string;
  pdfPath: string; // např. "/pdfs/ss/rovnice_a_nerovnice/linearni.pdf"
  type?: MaterialType;
  year?: number | null;
  level?: Level | null;
  tags?: string[];
};

export type Topic = {
  slug: string; // používáme _ místo -
  title: string;
  description?: string;
  tags?: string[];
  items: MaterialItem[];
};

export type Catalog = {
  topics: Topic[];
};

export type SectionKey = "ss" | "vs" | "research" | "insurance";