import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import {
  absoluteUrl,
  cleanSeoText,
  SITE_NAME,
} from "@/lib/seo";
import {
  PRODUCT_SEO_LOCALES,
  isProductLocale,
} from "@/lib/product-seo";

type PageProps = {
  params: Promise<{
    locale: string;
    type: string;
    slug: string;
  }>;
};

type ProductType = "IMPORT" | "EXPORT";

function normalizeType(value: string): ProductType | null {
  const normalized = value.toUpperCase();
  return normalized === "IMPORT" || normalized === "EXPORT"
    ? normalized
    : null;
}

function categoryUrl(locale: string, type: ProductType, slug: string) {
  return absoluteUrl(
    `/${locale}/products/${type.toLowerCase()}/category/${encodeURIComponent(slug)}`
  );
}

async function getCategory(locale: string, type: ProductType, slug: string) {
  return prisma.category.findFirst({
    where: {
      slug,
      type,
      active: true,
      products: {
        some: {
          status: "PUBLISHED",
          type,
        },
      },
    },
    include: {
      products: {
        where: {
          status: "PUBLISHED",
          type,
        },
        orderBy: [
          { featured: "desc" },
          { name: "asc" },
        ],
        include: {
          category: {
            select: { id: true, name: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
          translations: {
            where: { locale },
            take: 1,
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, type: typeParam, slug } = await params;
  const type = normalizeType(typeParam);

  if (
    !isProductLocale(locale) ||
    !type ||
    !PRODUCT_SEO_LOCALES.includes(
      locale as (typeof PRODUCT_SEO_LOCALES)[number]
    )
  ) {
    return { title: SITE_NAME };
  }

  const category = await getCategory(locale, type, slug);

  if (!category) {
    return { title: SITE_NAME };
  }

  const categoryName = cleanSeoText(category.name);
  const action = type === "IMPORT" ? "Import Categories" : "Export Categories";
  const title = `${categoryName} ${action} | ${SITE_NAME}`.slice(0, 65);
  const sourceDescription = cleanSeoText(category.description);
  const description = (
    sourceDescription ||
    `Explore ${categoryName} ${type === "IMPORT" ? "import products" : "export products"} from ${SITE_NAME}. View product details and contact us for specifications, packaging and quotations.`
  ).slice(0, 160);

  const canonical = categoryUrl(locale, type, category.slug);
  const languages: Record<string, string> = {};

  for (const supportedLocale of PRODUCT_SEO_LOCALES) {
    languages[supportedLocale] = categoryUrl(
      supportedLocale,
      type,
      category.slug
    );
  }

  languages["x-default"] = languages.en;

  return {
    title,
    description,
    keywords: [
      categoryName,
      `${categoryName} supplier India`,
      `${categoryName} ${type.toLowerCase()}`,
      `${categoryName} import export`,
      SITE_NAME,
    ],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: category.imageUrl ? [{ url: category.imageUrl }] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, type: typeParam, slug } = await params;
  const type = normalizeType(typeParam);

  if (!isProductLocale(locale) || !type) {
    notFound();
  }

  const category = await getCategory(locale, type, slug);

  if (!category) {
    notFound();
  }

  const categoryName = cleanSeoText(category.name);
  const description =
    cleanSeoText(category.description) ||
    `Explore ${categoryName} ${type === "IMPORT" ? "import products" : "export products"} from ${SITE_NAME}. Contact us for product details and quotations.`;

  const products = category.products.map((product) => {
    const translation = product.translations[0];

    return {
      ...product,
      name: translation?.name?.trim() || product.name,
      shortDescription:
        translation?.shortDescription?.trim() ||
        product.shortDescription,
      description:
        translation?.description?.trim() || product.description,
      category: product.category,
    };
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(`/${locale}`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: absoluteUrl(`/${locale}/products`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: type === "IMPORT" ? "Import" : "Export",
        item: absoluteUrl(`/${locale}/products/${type.toLowerCase()}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: categoryName,
        item: categoryUrl(locale, type, category.slug),
      },
    ],
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-sm text-[var(--foreground)]/65"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:underline">Products</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/products/${type.toLowerCase()}`}
              className="hover:underline"
            >
              {type === "IMPORT" ? "Import" : "Export"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-[var(--foreground)]">
            {categoryName}
          </li>
        </ol>
      </nav>

      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a24d]">
          {type === "IMPORT" ? "Import category" : "Export category"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
          {categoryName}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--foreground)]/70">
          {description}
        </p>
        <p className="mt-4 text-sm text-[var(--foreground)]/60">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </header>

      {products.length > 0 ? (
        <section
          aria-label={`${categoryName} products`}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <p className="rounded-2xl border border-[var(--border)] p-8 text-[var(--foreground)]/70">
          No published products are currently available in this category.
        </p>
      )}
    </main>
  );
}