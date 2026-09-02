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

  // původní/common
  description?: string;
  tags?: string[];
  items: MaterialItem[];

  // research
  authors?: string;
  journal?: string;
  year?: string;
  summary?: string;
  keyContribution?: string;
  keywords?: string[];

  // links
  doiUrl?: string;
  linkLabel?: string;
  pdfPath?: string;

  // insurance / ml-ds project metadata
  tools?: string[];
};

export type Catalog = {
  topics: Topic[];
};

export type SectionKey = "ss" | "vs" | "research" | "insurance" | "ml-ds" | "applications";