import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");

    if (typeParam !== "IMPORT" && typeParam !== "EXPORT") {
      return NextResponse.json(
        { success: false, message: "Invalid product type." },
        { status: 400 }
      );
    }

    const locale = searchParams.get("locale")?.trim() || "en";
    const search = searchParams.get("search")?.trim() || "";
    const categoryId = searchParams.get("categoryId")?.trim() || "";
    const featuredParam = searchParams.get("featured");

    const featured =
      featuredParam === "true"
        ? true
        : featuredParam === "false"
          ? false
          : undefined;

    const products = await prisma.product.findMany({
      where: {
        type: typeParam,
        status: "PUBLISHED",
        ...(categoryId ? { categoryId } : {}),
        ...(featured !== undefined ? { featured } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                {
                  shortDescription: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        translations: {
          where: { locale },
          take: 1,
          select: {
            locale: true,
            name: true,
            slug: true,
            shortDescription: true,
            description: true,
            imageAlt: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { updatedAt: "desc" },
      ],
    });

    const localizedProducts = products.map((product) => {
      const translation = product.translations[0];

      return {
        ...product,
        name: translation?.name?.trim() || product.name,
        slug: translation?.slug?.trim() || product.slug,
        shortDescription:
          translation?.shortDescription?.trim() ||
          product.shortDescription,
        description:
          translation?.description?.trim() ||
          product.description,
        images: product.images.map((image, index) => ({
          ...image,
          alt:
            index === 0 && translation?.imageAlt?.trim()
              ? translation.imageAlt.trim()
              : image.alt,
        })),
        translations: undefined,
      };
    });

    return NextResponse.json({
      success: true,
      products: localizedProducts,
    });
  } catch (error) {
    console.error("PUBLIC_PRODUCT_LIST_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Unable to load products." },
      { status: 500 }
    );
  }
}