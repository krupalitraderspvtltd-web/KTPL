export const PRODUCT_SEO_LOCALES = [
  "en",
  "gu",
  "hi",
  "ar",
  "af",
  "sq",
  "am",
  "hy",
  "az",
  "be",
  "bn",
  "bs",
  "bg",
  "ca",
  "zh-CN",
  "zh-TW",
  "hr",
  "cs",
  "da",
  "nl",
  "et",
  "fi",
  "fr",
  "ka",
  "de",
  "el",
  "ht",
  "he",
  "hu",
  "is",
  "id",
  "ga",
  "it",
  "ja",
  "kk",
  "km",
  "ko",
  "ky",
  "lo",
  "lv",
  "lt",
  "lb",
  "mk",
  "mg",
  "ms",
  "mt",
  "mi",
  "ne",
  "no",
  "fa",
  "fil",
  "pl",
  "pt",
  "ro",
  "ru",
  "sr",
  "si",
  "sk",
  "sl",
  "so",
  "es",
  "sw",
  "sv",
  "ta",
  "th",
  "tr",
  "uk",
  "ur",
  "uz",
  "vi",
  "cy",
] as const;

export type ProductLocale =
  (typeof PRODUCT_SEO_LOCALES)[number];

export const DEFAULT_PRODUCT_LOCALE: ProductLocale = "en";

export const PRODUCT_TYPES = [
  "IMPORT",
  "EXPORT",
] as const;

export type ProductType =
  (typeof PRODUCT_TYPES)[number];

export function isProductLocale(
  locale: string
): locale is ProductLocale {
  return PRODUCT_SEO_LOCALES.includes(
    locale as ProductLocale
  );
}

export function isProductType(
  type: string
): type is ProductType {
  return PRODUCT_TYPES.includes(
    type.toUpperCase() as ProductType
  );
}