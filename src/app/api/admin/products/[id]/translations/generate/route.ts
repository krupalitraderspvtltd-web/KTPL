import { NextResponse } from "next/server";

import {
  generateAllProductTranslations,
} from "@/lib/product-translation";

import { PRODUCT_SEO_LOCALES } from "@/lib/product-seo";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Generate all 71 language records.
     */
    const results =
      await generateAllProductTranslations(
        id
      );

    const successful =
      results.filter(
        (item) => item.success
      ).length;

    const failed =
      results.filter(
        (item) => !item.success
      ).length;

    return NextResponse.json({
      success: failed === 0,

      message:
        failed === 0
          ? `Successfully generated ${successful} language translations.`
          : `Generated ${successful} translations. ${failed} languages failed.`,

      totalLanguages:
        PRODUCT_SEO_LOCALES.length,

      successful,

      failed,

      results,
    });
  } catch (error) {
    console.error(
      "PRODUCT_TRANSLATION_GENERATION_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to generate product translations.",
      },
      {
        status: 500,
      }
    );
  }
}