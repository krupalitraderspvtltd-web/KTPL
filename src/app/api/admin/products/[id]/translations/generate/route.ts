import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { generateAllProductTranslations } from "@/lib/product-translation";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required." }, { status: 400 });
    }

    const results = await generateAllProductTranslations(id);
    const successful = results.filter((item) => item.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: failed === 0,
      message: failed === 0
        ? `Successfully generated ${successful} translations.`
        : `Generated ${successful} translations; ${failed} failed.`,
      totalLanguages: results.length,
      successful,
      failed,
      results,
    });
  } catch (error) {
    console.error("PRODUCT_TRANSLATION_GENERATION_ERROR", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unable to generate product translations.",
    }, { status: 500 });
  }
}
