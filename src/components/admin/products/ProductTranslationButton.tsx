"use client";

import { useState } from "react";

type Props = {
  productId: string;
};

export default function ProductTranslationButton({
  productId,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function generateTranslations() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const response =
        await fetch(
          `/api/admin/products/${productId}/translations/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Translation generation failed."
        );
      }

      setMessage(
        data.message ||
          "Translations generated successfully."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={
          generateTranslations
        }
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-[#1455a0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f4688] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Generating 71 Languages..."
          : "Generate 71-Language SEO"}
      </button>

      {message && (
        <p className="text-sm text-[var(--foreground)]/70">
          {message}
        </p>
      )}
    </div>
  );
}