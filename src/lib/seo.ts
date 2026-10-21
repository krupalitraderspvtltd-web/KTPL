export const SITE_URL =
  "https://www.krupalitraderspvtltd.com";

export const SITE_NAME =
  "Krupali Traders Private Limited";

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

export function cleanSeoText(value?: string | null): string {
  return (value ?? "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function productTitle(
  name: string,
  type: "IMPORT" | "EXPORT"
): string {
  const action =
    type === "IMPORT"
      ? "Importer & Supplier"
      : "Exporter & Supplier";

  const suffix = ` ${action} | Krupali Traders`;
  const cleanName = cleanSeoText(name);
  const maxNameLength = Math.max(1, 65 - suffix.length);

  const shortenedName =
    cleanName.length > maxNameLength
      ? `${cleanName.slice(0, maxNameLength - 1).trim()}...`
      : cleanName;

  return `${shortenedName}${suffix}`;
}

export function productDescription(
  name: string,
  description?: string | null
): string {
  const cleanName = cleanSeoText(name);
  const source = cleanSeoText(description);

  const base =
    source ||
    `${cleanName} supplied by Krupali Traders Private Limited for professional trade. Contact us for specifications, packaging, minimum order quantities and quotation details.`;

  if (base.length <= 160) return base;

  const shortened = base.slice(0, 157);
  const lastSpace = shortened.lastIndexOf(" ");
  const end = lastSpace > 120 ? lastSpace : shortened.length;
  return `${shortened.slice(0, end).trim()}...`;
}

export function productKeywords(
  name: string,
  type: "IMPORT" | "EXPORT",
  categoryName?: string | null
): string[] {
  const cleanName = cleanSeoText(name);
  const cleanCategory = cleanSeoText(categoryName);

  const action = type === "IMPORT" ? "importer" : "exporter";

  return [
    cleanName,
    `${cleanName} supplier India`,
    `${cleanName} ${action} India`,
    ...(cleanCategory
      ? [
          `${cleanCategory} supplier India`,
          `${cleanName} ${cleanCategory}`,
        ]
      : []),
    "Krupali Traders",
    "Krupali Traders Private Limited",
  ].filter(
    (keyword, index, all) =>
      keyword.length > 0 &&
      all.findIndex(
        (item) => item.toLowerCase() === keyword.toLowerCase()
      ) === index
  );
}

export function localizedProductUrl(
  locale: string,
  type: string,
  slug: string
) {
  return absoluteUrl(
    `/${locale}/products/${type.toLowerCase()}/${slug}`
  );
}