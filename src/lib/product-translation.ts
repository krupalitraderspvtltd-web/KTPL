import OpenAI from "openai";

import { prisma } from "@/lib/prisma";

import {
  PRODUCT_SEO_LOCALES,
  type ProductLocale,
} from "@/lib/product-seo";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey,
  });
}

/* =========================================================
   TYPES
========================================================= */

type ProductSource = {
  id: string;
  name: string;
  slug: string;
  type: "IMPORT" | "EXPORT";

  shortDescription: string | null;
  description: string | null;
  specifications: string | null;
  countryOfOrigin: string | null;
  packaging: string | null;
  minimumOrderQuantity: string | null;

  images: {
    url: string;
    alt: string | null;
  }[];

  category: {
    name: string;
  } | null;
};

type GeneratedTranslation = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  specifications: string;
  countryOfOrigin: string;
  packaging: string;
  minimumOrderQuantity: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  imageAlt: string;
};

type BatchTranslationResult = Record<
  string,
  GeneratedTranslation
>;

/* =========================================================
   LANGUAGE NAMES
========================================================= */

const LANGUAGE_NAMES: Record<
  ProductLocale,
  string
> = {
  en: "English",
  gu: "Gujarati",
  hi: "Hindi",
  ar: "Arabic",
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  hy: "Armenian",
  az: "Azerbaijani",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  "zh-CN": "Simplified Chinese",
  "zh-TW": "Traditional Chinese",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  et: "Estonian",
  fi: "Finnish",
  fr: "French",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  ht: "Haitian Creole",
  he: "Hebrew",
  hu: "Hungarian",
  is: "Icelandic",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ky: "Kyrgyz",
  lo: "Lao",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  mt: "Maltese",
  mi: "MÄori",
  ne: "Nepali",
  no: "Norwegian",
  fa: "Persian",
  fil: "Filipino",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sr: "Serbian",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  sw: "Swahili",
  sv: "Swedish",
  ta: "Tamil",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
};

/* =========================================================
   CONFIG
========================================================= */

/*
 * Number of languages sent in one OpenAI request.
 *
 * 8 is a good balance between:
 * - API request count
 * - response size
 * - reliability
 */
const BATCH_SIZE = 8;

/*
 * Number of OpenAI requests running at once.
 */
const CONCURRENCY = 3;

/*
 * Retry failed batches.
 */
const MAX_RETRIES = 3;

/* =========================================================
   HELPERS
========================================================= */

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

function chunk<T>(
  items: T[],
  size: number
): T[][] {
  const chunks: T[][] = [];

  for (
    let i = 0;
    i < items.length;
    i += size
  ) {
    chunks.push(
      items.slice(i, i + size)
    );
  }

  return chunks;
}

function cleanJson(
  text: string
): string {
  let value = text.trim();

  if (value.startsWith("```")) {
    value = value.replace(
      /^```(?:json)?\s*/i,
      ""
    );

    value = value.replace(
      /\s*```$/,
      ""
    );
  }

  return value.trim();
}

function validateTranslation(
  value: unknown,
  locale: string
): GeneratedTranslation {
  if (
    !value ||
    typeof value !== "object"
  ) {
    throw new Error(
      `Invalid translation object for ${locale}`
    );
  }

  const data =
    value as Record<
      string,
      unknown
    >;

  const requiredFields = [
    "name",
    "slug",
    "shortDescription",
    "description",
    "specifications",
    "countryOfOrigin",
    "packaging",
    "minimumOrderQuantity",
    "seoTitle",
    "seoDescription",
    "seoKeywords",
    "imageAlt",
  ] as const;

  for (const field of requiredFields) {
    if (
      typeof data[field] !== "string"
    ) {
      throw new Error(
        `Missing "${field}" for locale ${locale}`
      );
    }
  }

  return data as GeneratedTranslation;
}

/* =========================================================
   ENGLISH TRANSLATION
========================================================= */

async function saveEnglishTranslation(
  product: ProductSource
) {
  return prisma.productTranslation.upsert(
    {
      where: {
        productId_locale: {
          productId: product.id,
          locale: "en",
        },
      },

      create: {
        productId: product.id,
        locale: "en",

        name: product.name,
        slug: product.slug,

        shortDescription:
          product.shortDescription,

        description:
          product.description,

        specifications:
          product.specifications,

        countryOfOrigin:
          product.countryOfOrigin,

        packaging:
          product.packaging,

        minimumOrderQuantity:
          product.minimumOrderQuantity,

        seoTitle: `${product.name} ${
          product.type === "IMPORT"
            ? "Importer & Supplier"
            : "Exporter & Supplier"
        } from India | Krupali Traders`,

        seoDescription:
          product.shortDescription ||
          product.description ||
          `${product.name} supplied by Krupali Traders Private Limited for professional domestic and international trade.`,

        seoKeywords: [
          product.name,
          `${product.name} supplier India`,
          `${product.name} exporter India`,
          `${product.name} importer India`,
          "Krupali Traders",
        ].join(", "),

        imageAlt:
          product.images[0]?.alt ||
          product.name,
      },

      update: {
        name: product.name,
        slug: product.slug,

        shortDescription:
          product.shortDescription,

        description:
          product.description,

        specifications:
          product.specifications,

        countryOfOrigin:
          product.countryOfOrigin,

        packaging:
          product.packaging,

        minimumOrderQuantity:
          product.minimumOrderQuantity,

        imageAlt:
          product.images[0]?.alt ||
          product.name,
      },
    }
  );
}

/* =========================================================
   BATCH PROMPT
========================================================= */

function createBatchPrompt(
  product: ProductSource,
  locales: ProductLocale[]
) {
  const languages = locales
    .map(
      (locale) =>
        `${locale}: ${LANGUAGE_NAMES[locale]}`
    )
    .join("\n");

  return `
You are a professional international trade translator
and multilingual SEO copywriter.

Translate the following product into ALL requested
target languages.

TARGET LANGUAGES:

${languages}

BUSINESS:

Krupali Traders Private Limited

BUSINESS TYPE:

India-based import and export company.

PRODUCT TYPE:

${product.type}

IMPORTANT RULES:

1. Preserve factual meaning.
2. Do not invent certifications.
3. Do not invent prices.
4. Do not invent grades.
5. Do not invent specifications.
6. Do not invent country of origin.
7. Do not invent packaging.
8. Do not invent MOQ.
9. Do not invent guarantees.
10. Keep brand names recognizable.
11. Translate naturally for native speakers.
12. Use professional B2B trade terminology.
13. SEO titles must naturally describe the product.
14. SEO descriptions must be useful and natural.
15. Avoid keyword stuffing.
16. SEO keywords must be comma-separated phrases.
17. Generate a URL-friendly slug.
18. Keep slugs reasonably short.
19. Do not use HTML.
20. Do not use Markdown.
21. Return ONLY valid JSON.
22. Every requested locale MUST be included.
23. Do not omit any requested locale.
24. Preserve factual specifications exactly.

SOURCE PRODUCT

Name:
${product.name}

Slug:
${product.slug}

Category:
${product.category?.name ?? ""}

Short description:
${product.shortDescription ?? ""}

Description:
${product.description ?? ""}

Specifications:
${product.specifications ?? ""}

Country of origin:
${product.countryOfOrigin ?? ""}

Packaging:
${product.packaging ?? ""}

Minimum order quantity:
${product.minimumOrderQuantity ?? ""}

Image ALT:
${product.images[0]?.alt ?? ""}

RETURN THIS EXACT STRUCTURE:

{
  "locale": {
    "name": "...",
    "slug": "...",
    "shortDescription": "...",
    "description": "...",
    "specifications": "...",
    "countryOfOrigin": "...",
    "packaging": "...",
    "minimumOrderQuantity": "...",
    "seoTitle": "...",
    "seoDescription": "...",
    "seoKeywords": "...",
    "imageAlt": "..."
  }
}

Replace "locale" with each requested
locale code.
`;
}

/* =========================================================
   GENERATE ONE BATCH
========================================================= */

async function generateBatch(
  product: ProductSource,
  locales: ProductLocale[]
): Promise<BatchTranslationResult> {
    const openai = getOpenAIClient();

  let lastError: unknown = null;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      const response =
        await openai.responses.create(
          {
            model: "gpt-5.6-luna",

            input:
              createBatchPrompt(
                product,
                locales
              ),

            text: {
              format: {
                type: "json_object",
              },
            },
          }
        );

      const output =
        response.output_text?.trim();

      if (!output) {
        throw new Error(
          "Empty OpenAI response."
        );
      }

      const parsed =
        JSON.parse(
          cleanJson(output)
        ) as Record<
          string,
          unknown
        >;

      const result: BatchTranslationResult =
        {};

      for (const locale of locales) {
        const value =
          parsed[locale];

        if (!value) {
          throw new Error(
            `Locale ${locale} missing from OpenAI response.`
          );
        }

        result[locale] =
          validateTranslation(
            value,
            locale
          );
      }

      return result;
    } catch (error) {
      lastError = error;

      console.error(
        `Translation batch failed. Attempt ${attempt}/${MAX_RETRIES}`,
        error
      );

      if (
        attempt <
        MAX_RETRIES
      ) {
        await sleep(
          1500 * attempt
        );
      }
    }
  }

  throw (
    lastError instanceof Error
      ? lastError
      : new Error(
          "Translation batch failed."
        )
  );
}

/* =========================================================
   SAVE TRANSLATION
========================================================= */

async function saveTranslation(
  productId: string,
  locale: ProductLocale,
  translation: GeneratedTranslation
) {
  return prisma.productTranslation.upsert(
    {
      where: {
        productId_locale: {
          productId,
          locale,
        },
      },

      create: {
        productId,
        locale,

        name: translation.name,
        slug: translation.slug,

        shortDescription:
          translation.shortDescription,

        description:
          translation.description,

        specifications:
          translation.specifications,

        countryOfOrigin:
          translation.countryOfOrigin,

        packaging:
          translation.packaging,

        minimumOrderQuantity:
          translation.minimumOrderQuantity,

        seoTitle:
          translation.seoTitle,

        seoDescription:
          translation.seoDescription,

        seoKeywords:
          translation.seoKeywords,

        imageAlt:
          translation.imageAlt,
      },

      update: {
        name: translation.name,
        slug: translation.slug,

        shortDescription:
          translation.shortDescription,

        description:
          translation.description,

        specifications:
          translation.specifications,

        countryOfOrigin:
          translation.countryOfOrigin,

        packaging:
          translation.packaging,

        minimumOrderQuantity:
          translation.minimumOrderQuantity,

        seoTitle:
          translation.seoTitle,

        seoDescription:
          translation.seoDescription,

        seoKeywords:
          translation.seoKeywords,

        imageAlt:
          translation.imageAlt,
      },
    }
  );
}

/* =========================================================
   MAIN GENERATOR
========================================================= */

export async function generateAllProductTranslations(
  productId: string
) {
  const product =
    await prisma.product.findUnique(
      {
        where: {
          id: productId,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      }
    );

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  /*
   * Save English directly.
   * No AI request required.
   */
  await saveEnglishTranslation(
    product
  );

  /*
   * Generate only the other languages.
   */
  const targetLocales =
    PRODUCT_SEO_LOCALES.filter(
      (locale) => locale !== "en"
    );

  const batches = chunk(
    targetLocales,
    BATCH_SIZE
  );

  const results: Array<{
    locale: string;
    success: boolean;
    error?: string;
  }> = [];

  /*
   * Process several batches concurrently.
   *
   * Example:
   *
   * Batch 1 â†’ 8 languages
   * Batch 2 â†’ 8 languages
   * Batch 3 â†’ 8 languages
   *
   * simultaneously.
   */
  for (
    let i = 0;
    i < batches.length;
    i += CONCURRENCY
  ) {
    const currentBatches =
      batches.slice(
        i,
        i + CONCURRENCY
      );

    const batchResults =
      await Promise.allSettled(
        currentBatches.map(
          (batch) =>
            generateBatch(
              product,
              batch
            )
        )
      );

    for (
      let batchIndex = 0;
      batchIndex <
      batchResults.length;
      batchIndex++
    ) {
      const batchResult =
        batchResults[batchIndex];

      const batch =
        currentBatches[
          batchIndex
        ];

      if (
        batchResult.status ===
        "fulfilled"
      ) {
        const translations =
          batchResult.value;

        for (const locale of batch) {
          try {
            await saveTranslation(
              product.id,
              locale,
              translations[
                locale
              ]
            );

            results.push({
              locale,
              success: true,
            });
          } catch (error) {
            results.push({
              locale,
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Database save failed.",
            });
          }
        }
      } else {
        const errorMessage =
          batchResult.reason
            instanceof Error
            ? batchResult.reason
                .message
            : "Translation batch failed.";

        for (const locale of batch) {
          results.push({
            locale,
            success: false,
            error: errorMessage,
          });
        }
      }
    }
  }

  return results;
}




