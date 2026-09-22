CREATE TABLE IF NOT EXISTS "ProductTranslation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "specifications" TEXT,
    "countryOfOrigin" TEXT,
    "packaging" TEXT,
    "minimumOrderQuantity" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "imageAlt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id"),

    CONSTRAINT "ProductTranslation_productId_fkey"
        FOREIGN KEY ("productId")
        REFERENCES "Product"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProductTranslation_productId_locale_key"
    ON "ProductTranslation" ("productId", "locale");

CREATE INDEX IF NOT EXISTS "ProductTranslation_locale_idx"
    ON "ProductTranslation" ("locale");

CREATE INDEX IF NOT EXISTS "ProductTranslation_slug_idx"
    ON "ProductTranslation" ("slug");
