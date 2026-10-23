import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { PRODUCT_SEO_LOCALES, PRODUCT_TYPES } from "@/lib/product-seo";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.krupalitraderspvtltd.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/about",
    "/products",
    "/products/import",
    "/products/export",
    "/blog",
    "/contact",
  ];

  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of PRODUCT_SEO_LOCALES) {
    for (const page of staticPages) {
      staticEntries.push({
        url: `${SITE_URL}/${locale}${page}`,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      type: true,
      updatedAt: true,
      translations: {
        select: {
          locale: true,
          slug: true,
        },
      },
    },
  });

  const productEntries: MetadataRoute.Sitemap = [];

  for (const product of products) {
    if (
      !PRODUCT_TYPES.includes(
        product.type as (typeof PRODUCT_TYPES)[number]
      )
    ) {
      continue;
    }

    const slugByLocale = new Map<string, string>();
    slugByLocale.set("en", product.slug);

    for (const translation of product.translations) {
      if (
        PRODUCT_SEO_LOCALES.includes(
          translation.locale as (typeof PRODUCT_SEO_LOCALES)[number]
        ) &&
        translation.slug
      ) {
        slugByLocale.set(translation.locale, translation.slug);
      }
    }

    const languageUrls: Record<string, string> = {};

    for (const locale of PRODUCT_SEO_LOCALES) {
      const localizedSlug = slugByLocale.get(locale) || product.slug;

      languageUrls[locale] =
        `${SITE_URL}/${locale}/products/${product.type.toLowerCase()}/${localizedSlug}`;
    }

    for (const locale of PRODUCT_SEO_LOCALES) {
      productEntries.push({
        url: languageUrls[locale],
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            ...languageUrls,
            "x-default": languageUrls.en,
          },
        },
      });
    }
  }

  const categories = await prisma.category.findMany({
    where: {
      active: true,
      products: {
        some: {
          status: "PUBLISHED",
        },
      },
    },
    select: {
      slug: true,
      type: true,
      updatedAt: true,
    },
  });

  const categoryEntries: MetadataRoute.Sitemap = [];

  for (const category of categories) {
    if (
      !PRODUCT_TYPES.includes(
        category.type as (typeof PRODUCT_TYPES)[number]
      )
    ) {
      continue;
    }

    const languageUrls: Record<string, string> = {};

    for (const locale of PRODUCT_SEO_LOCALES) {
      languageUrls[locale] =
        `${SITE_URL}/${locale}/products/${category.type.toLowerCase()}/category/${encodeURIComponent(category.slug)}`;
    }

    for (const locale of PRODUCT_SEO_LOCALES) {
      categoryEntries.push({
        url: languageUrls[locale],
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.65,
        alternates: {
          languages: {
            ...languageUrls,
            "x-default": languageUrls.en,
          },
        },
      });
    }
  }
  return [...staticEntries, ...productEntries, ...categoryEntries];
}
