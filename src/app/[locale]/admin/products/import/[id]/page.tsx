import { notFound, redirect } from "next/navigation";

import ProductForm from "@/components/admin/products/ProductForm";
import ProductTranslationButton from "@/components/admin/products/ProductTranslationButton";

import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type EditImportProductPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function EditImportProductPage({
  params,
}: EditImportProductPageProps) {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const { locale, id } = await params;

  const [product, categories] =
    await Promise.all([
      prisma.product.findUnique({
        where: {
          id,
        },
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      }),

      prisma.category.findMany({
        where: {
          type: "IMPORT",
          active: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  if (!product) {
    notFound();
  }

  /*
   * Prevent an EXPORT product from being edited
   * through the IMPORT route.
   */
  if (product.type !== "IMPORT") {
    redirect(
      `/${locale}/admin/products/import`
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* =====================================================
            PRODUCT TRANSLATION / SEO
        ===================================================== */}

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Multilingual Product SEO
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground)]/60">
                Generate product content, SEO metadata,
                keywords, localized slugs and image ALT
                text for all 71 supported languages.
              </p>
            </div>

            <div className="shrink-0">
              <ProductTranslationButton
                productId={product.id}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT FORM
        ===================================================== */}

        <ProductForm
          type="IMPORT"
          categories={categories}
          product={product}
        />
      </div>
    </main>
  );
}