export const SITE_URL = "https://www.krupalitraderspvtltd.com";
export const SITE_NAME = "Krupali Traders Private Limited";
export const DEFAULT_LOCALE = "en";

export const DEFAULT_TITLE =
  "Krupali Traders Private Limited | Global Import & Export Company";

export const DEFAULT_DESCRIPTION =
  "Krupali Traders Private Limited is an India-based import and export company supplying Indian spices, fresh fruits, vegetables, herbs, dry fruits, nuts, seafood and other trade products to global buyers.";

export const KEYWORDS = [
  "Krupali Traders",
  "Krupali Traders Private Limited",
  "Krupali Traders India",
  "Krupali Traders Gujarat",
  "Krupali Traders exporter",
  "Krupali Traders import export",
  "Indian spices exporter",
  "Indian spices supplier",
  "fresh fruits exporter India",
  "fresh vegetables exporter India",
  "Indian herbs exporter",
  "dry fruits exporter India",
  "nuts exporter India",
  "seafood exporter India",
  "fish exporter India",
  "dry fish exporter India",
  "metal scrap exporter India",
];

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productTitle(
  name: string,
  type: "IMPORT" | "EXPORT"
) {
  const action =
    type === "IMPORT" ? "Importer & Supplier" : "Exporter & Supplier";
  return `${name} ${action} from India | Krupali Traders`;
}

export function productDescription(
  name: string,
  description?: string | null
) {
  const base =
    description?.trim() ||
    `${name} supplied by Krupali Traders Private Limited for professional domestic and international trade. Contact us for specifications, packaging, MOQ and quotation details.`;

  return base.length > 160 ? `${base.slice(0, 157).trim()}...` : base;
}
