import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const SITE_URL = "https://www.krupalitraderspvtltd.com";

const LOCALES = ["en", "gu", "hi", "ar"] as const;
const DEFAULT_LOCALE = "en";

const PRODUCT_TYPES = ["IMPORT", "EXPORT"] as const;
const PUBLISHED_STATUS = "PUBLISHED";

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

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      staticEntries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  const products = await prisma.product.findMany({
    where: {
      status: PUBLISHED_STATUS,
    },
    select: {
      slug: true,
      type: true,
      updatedAt: true,
    },
  });

  const productEntries: MetadataRoute.Sitemap = [];

  for (const product of products) {
    if (!PRODUCT_TYPES.includes(product.type as (typeof PRODUCT_TYPES)[number])) {
      continue;
    }

    for (const locale of LOCALES) {
      productEntries.push({
        url: `${SITE_URL}/${locale}/products/${product.type.toLowerCase()}/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return [...staticEntries, ...productEntries];
}