"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  PackageCheck,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/products/ProductCard";

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

type ProductCategory = {
  id: string;
  name: string;
  image?: string | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  type: "IMPORT" | "EXPORT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  shortDescription: string | null;
  description: string | null;
  specifications: string | null;

  countryOfOrigin: string | null;
  packaging: string | null;
  minimumOrderQuantity: string | null;

  featured: boolean;

  category: ProductCategory | null;

  images: ProductImage[];
};

type CategoryWithThumbnail = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
};

/* ============================================================
   CATEGORY FALLBACK IMAGES
   ============================================================ */

const CATEGORY_FALLBACK_IMAGES: Record<
  string,
  string
> = {
  "Indian Spices":
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=85",

  "Nuts & Seed":
    "https://down-my.img.susercontent.com/file/2fdb7d8f2a69cb220a9327d0b74ecdba",

  Handicrafts:
    "https://shikhas.co/cdn/shop/files/handicraft-brand.png?v=1780937039&width=1200",

  Honey:
    "https://d2j6dbq0eux0bg.cloudfront.net/images/78328829/products/635443944/5761458506.jpg",

  "Fresh Vegetable":
    "https://voxdev.org/sites/default/files/cover_images/AdobeStock_8183040732.jpeg",
};

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Determines whether an image URL is a placeholder.
 */
function isPlaceholderImage(
  url: string | null | undefined
): boolean {
  if (!url) {
    return true;
  }

  const normalizedUrl =
    url.toLowerCase().trim();

  return (
    normalizedUrl.includes("placehold.co") ||
    normalizedUrl.includes("placeholder.com") ||
    normalizedUrl.includes("placeholder")
  );
}

/**
 * Returns the first real image from a product.
 */
function getRealProductImage(
  product: Product
): string | null {
  const sortedImages =
    product.images
      ?.slice()
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder
      ) || [];

  const realImage =
    sortedImages.find(
      (image) =>
        image.url &&
        !isPlaceholderImage(image.url)
    );

  return realImage?.url || null;
}

/**
 * Returns the best image available for a category.
 *
 * Priority:
 * 1. Real product image
 * 2. Category fallback image
 * 3. null
 */
function getCategoryFallbackImage(
  categoryName: string
): string | null {
  return (
    CATEGORY_FALLBACK_IMAGES[
      categoryName
    ] || null
  );
}

/**
 * Localize category display names while preserving database values.
 * Unknown categories fall back to their original name.
 */
function getLocalizedCategoryName(
  name: string,
  locale: string
): string {
  const key = name.trim().toLowerCase();

  const translations: Record<string, Record<string, string>> = {
    "indian spices": {
      gu: "\u0aad\u0abe\u0ab0\u0aa4\u0ac0\u0aaf \u0aae\u0ab8\u0abe\u0ab2\u0abe",
      hi: "\u092d\u093e\u0930\u0924\u0940\u092f \u092e\u0938\u093e\u0932\u0947",
    },
    "dry fish": {
      gu: "\u0ab8\u0ac2\u0a95\u0ac0 \u0aae\u0abe\u0a9b\u0ab2\u0ac0",
      hi: "\u0938\u0942\u0916\u0940 \u092e\u091b\u0932\u0940",
    },
    "nuts & seed": {
      gu: "\u0ab8\u0ac2\u0a95\u0abe \u0aae\u0ac7\u0ab5\u0abe \u0a85\u0aa8\u0ac7 \u0aac\u0ac0\u0a9c",
      hi: "\u092e\u0947\u0935\u0947 \u0914\u0930 \u092c\u0940\u091c",
    },
    "dal": {
      gu: "\u0aa6\u0abe\u0ab3",
      hi: "\u0926\u093e\u0932",
    },
    "garam masala": {
      gu: "\u0a97\u0ab0\u0aae \u0aae\u0ab8\u0abe\u0ab2\u0acb",
      hi: "\u0917\u0930\u092e \u092e\u0938\u093e\u0932\u093e",
    },
    "powder": {
      gu: "\u0aaa\u0abe\u0ab5\u0aa1\u0ab0",
      hi: "\u092a\u093e\u0909\u0921\u0930",
    },
    "handicrafts": {
      gu: "\u0ab9\u0ab8\u0acd\u0aa4\u0a95\u0ab2\u0abe",
      hi: "\u0939\u0938\u094d\u0924\u0936\u093f\u0932\u094d\u092a",
    },
    "honey": {
      gu: "\u0aae\u0aa7",
      hi: "\u0936\u0939\u0926",
    },
    "fresh vegetable": {
      gu: "\u0aa4\u0abe\u0a9c\u0abe \u0ab6\u0abe\u0a95\u0aad\u0abe\u0a9c\u0ac0",
      hi: "\u0924\u093e\u091c\u093c\u0940 \u0938\u092c\u094d\u091c\u093c\u093f\u092f\u093e\u0901",
    },
  };

  return translations[key]?.[locale] || name;
}

/* ============================================================
   MAIN CONTENT
   ============================================================ */

function ImportProductsContent() {
  const searchParams =
    useSearchParams();

  const params = useParams();

  const t = useTranslations("ImportListing");

  const locale =
    (params?.locale as string) || "en";

  const categoryId =
    searchParams
      .get("categoryId")
      ?.trim() || "";

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<CategoryWithThumbnail[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD PRODUCTS
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const query =
          new URLSearchParams();

        query.set("type", "IMPORT");
      query.set("locale", locale);

        if (categoryId) {
          query.set(
            "categoryId",
            categoryId
          );
        }

        const response =
          await fetch(
            `/api/products?${query.toString()}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Unable to load import data."
          );
        }

        const data =
          await response.json();

        if (!mounted) {
          return;
        }

        const fetchedProducts =
          Array.isArray(data.products)
            ? data.products
            : [];

        setProducts(
          fetchedProducts
        );

        /* ======================================================
           BUILD CATEGORY LIST
           ====================================================== */

        if (!categoryId) {
          const catMap =
            new Map<
              string,
              CategoryWithThumbnail
            >();

          fetchedProducts.forEach(
            (product: Product) => {
              if (
                !product.category
              ) {
                return;
              }

              const catId =
                product.category.id;

              const categoryName =
                product.category.name;

              const existing =
                catMap.get(catId);

              /*
               * Look for a REAL image.
               *
               * This searches every product
               * belonging to the category.
               *
               * It ignores placehold.co.
               */
              const realImage =
                getRealProductImage(
                  product
                );

              /*
               * Category-specific fallback.
               */
              const fallbackImage =
                getCategoryFallbackImage(
                  categoryName
                );

              /* ----------------------------------------------
                 FIRST PRODUCT IN CATEGORY
                 ---------------------------------------------- */

              if (!existing) {
                catMap.set(catId, {
                  id: catId,

                  name: categoryName,

                  /*
                   * Priority:
                   * real product image
                   * fallback category image
                   * null
                   */
                  thumbnailUrl:
                    realImage ||
                    fallbackImage ||
                    null,
                });

                return;
              }

              /* ----------------------------------------------
                 UPDATE CATEGORY IF REAL IMAGE FOUND
                 ---------------------------------------------- */

              /*
               * If the existing image is a fallback,
               * replace it with a real product image.
               */
              const existingIsFallback =
                existing.thumbnailUrl ===
                fallbackImage;

              if (
                realImage &&
                (
                  !existing.thumbnailUrl ||
                  existingIsFallback ||
                  isPlaceholderImage(
                    existing.thumbnailUrl
                  )
                )
              ) {
                existing.thumbnailUrl =
                  realImage;
              }
            }
          );

          setCategories(
            Array.from(
              catMap.values()
            )
          );
        }
      } catch (err) {
        console.error(
          "IMPORT_DATA_LOAD_ERROR",
          err
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load import data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [categoryId, locale]);

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="gradient-section overflow-hidden">
      {/* ======================================================
          HERO
          ====================================================== */}

      <section className="relative overflow-hidden px-5 pb-16 pt-44 sm:pb-20 sm:pt-48 lg:px-8">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#68b0ff]/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#c9a24d]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            {/* Label */}
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#c9a24d] dark:text-[#d8b45b]">
              {categoryId
                ? t("filteredCategory")
                : t("availableCategories")}
            </div>

            {/* Heading */}
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              <span className="gradient-text">
                {categoryId
                  ? t("exploreCategoryProducts")
                  : t("exploreImportCategories")}
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--foreground)]/65 sm:text-lg">
              {categoryId
                ? t("filteredDescription")
                : t("browseDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          PRODUCTS / CATEGORIES SECTION
          ====================================================== */}

      <section className="px-5 pb-20 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              BACK BUTTON
              ================================================== */}

          {categoryId && (
            <div className="mb-8 flex justify-start">
              <Link
                href={`/${locale}/products/import`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--primary-light)]"
              >
                {t("backToAllCategories")}
              </Link>
            </div>
          )}

          {/* ==================================================
              COUNT BADGE
              ================================================== */}

          <div className="mb-8 flex justify-center sm:justify-end">
            <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm">
              {loading
                ? "Loading..."
                : categoryId
                ? `${products.length} ${
                    locale === "gu"
                      ? "\u0a89\u0aa4\u0acd\u0aaa\u0abe\u0aa6\u0aa8\u0acb"
                      : locale === "hi"
                      ? "\u0909\u0924\u094d\u092a\u093e\u0926"
                      : products.length === 1
                      ? "Product"
                      : "Products"
                  }`
                : `${categories.length} ${
                    locale === "gu"
                      ? "\u0ab6\u0acd\u0ab0\u0ac7\u0aa3\u0ac0\u0a93"
                      : locale === "hi"
                      ? "\u0936\u094d\u0930\u0947\u0923\u093f\u092fाँ"
                      : categories.length === 1
                      ? "Category"
                      : "Categories"
                  }`}
            </div>
          </div>

          {/* ==================================================
              ERROR
              ================================================== */}

          {error && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-center text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* ==================================================
              LOADING SKELETON
              ================================================== */}

          {loading && !error && (
            <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm"
                  >
                    <div className="aspect-[4/3] animate-pulse bg-[var(--primary-light)]" />

                    <div className="space-y-4 p-7">
                      <div className="h-7 w-40 animate-pulse rounded bg-[var(--primary-light)]" />

                      <div className="h-4 w-24 animate-pulse rounded bg-[var(--primary-light)]" />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* ==================================================
              CATEGORIES GRID
              ================================================== */}

          {!loading &&
            !error &&
            !categoryId &&
            categories.length > 0 && (
              <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map(
                  (cat) => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/products/import?categoryId=${cat.id}`}
                      className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:gap-4 sm:rounded-[2rem] sm:p-5"
                    >
                      {/* ========================================
                          CATEGORY IMAGE
                          ======================================== */}

                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--primary-light)]">
                        {cat.thumbnailUrl ? (
                          <img
                            src={
                              cat.thumbnailUrl
                            }
                            alt={
                              cat.name
                            }
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                            onError={(
                              event
                            ) => {
                              /*
                               * If a remote fallback
                               * image fails, hide it
                               * and show the folder icon.
                               */
                              const image =
                                event.currentTarget;

                              image.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#1455a0] dark:text-[#68b0ff]">
                            <FolderOpen
                              size={24}
                            />
                          </div>
                        )}

                        {/* Fallback icon behind image */}
                        <div className="absolute inset-0 -z-0 flex items-center justify-center text-[#1455a0] dark:text-[#68b0ff]">
                          <FolderOpen
                            size={24}
                          />
                        </div>
                      </div>

                      {/* ========================================
                          CATEGORY NAME
                          ======================================== */}

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 break-words text-base font-bold text-[var(--foreground)] transition group-hover:text-[#1455a0] dark:group-hover:text-[#68b0ff] sm:text-lg">
                          {getLocalizedCategoryName(cat.name, locale)}
                        </h3>

                        <p className="mt-1 text-xs text-[var(--foreground)]/60">
                          {t("viewItems")}
                        </p>
                      </div>

                      {/* ========================================
                          ARROW
                          ======================================== */}

                      <ArrowRight
                        className="flex-shrink-0 text-[var(--foreground)]/30 transition group-hover:translate-x-1 group-hover:text-[#1455a0] dark:group-hover:text-[#68b0ff]"
                        size={20}
                      />
                    </Link>
                  )
                )}
              </div>
            )}

          {/* ==================================================
              PRODUCTS GRID
              ================================================== */}

          {!loading &&
            !error &&
            categoryId &&
            products.length > 0 && (
              <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}
              </div>
            )}

          {/* ==================================================
              EMPTY STATE
              ================================================== */}

          {!loading &&
            !error &&
            (
              (categoryId &&
                products.length === 0) ||
              (!categoryId &&
                categories.length === 0)
            ) && (
              <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm sm:p-14">
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
                  <PackageCheck
                    size={30}
                    className="text-[#1455a0] dark:text-[#68b0ff]"
                  />
                </div>

                {/* Heading */}
                <h2 className="mt-6 text-2xl font-bold text-[var(--foreground)]">
                  {categoryId
                    ? "Currently no product available for this category"
                    : "No import categories available"}
                </h2>

                {/* Description */}
                <p className="mt-3 leading-7 text-[var(--foreground)]/60">
                  {categoryId
                    ? "There are currently no published products available in this category."
                    : "Our import product catalogue is currently being updated."}
                </p>

                {/* Contact button */}
                <Link
                  href={`/${locale}/contact`}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1455a0] px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f4688]"
                >
                  Discuss Requirements
                  <ArrowRight
                    size={17}
                  />
                </Link>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

/* ==============================================================
   PAGE
   ============================================================== */

export default function ImportProductsPage() {
  return (
    <Suspense fallback={null}>
      <ImportProductsContent />
    </Suspense>
  );
}