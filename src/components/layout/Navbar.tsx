"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Globe,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";


import {
  Link,
  usePathname,
  useRouter,
} from "@/i18n/routing";

import { useTheme } from "@/components/layout/ThemeProvider";

const languages = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
  },
  {
    code: "gu",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    flag: "🇮🇳",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    flag: "🇮🇳",
  },
  {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    flag: "🇸🇦",
  },
];

type NavbarProps = {
  isAdmin?: boolean;
};

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const t = useTranslations("Navbar");

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const currentLanguage =
    languages.find((item) => item.code === locale) ??
    languages[0];

  function changeLanguage(newLocale: string) {
    setLanguageOpen(false);
    setMobileOpen(false);
    setProductsOpen(false);

    if (newLocale === locale) {
      return;
    }

    router.replace(pathname, {
      locale: newLocale,
    });
  }

  function closeMenus() {
    setMobileOpen(false);
    setProductsOpen(false);
    setLanguageOpen(false);
  }

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-5 sm:px-6">
        <nav
          className="
            mx-auto
            flex
            h-[78px]
            max-w-[1400px]
            items-center
            rounded-full
            border
            border-[var(--border)]
            bg-[var(--surface)]/95
            px-4
            shadow-xl
            shadow-black/10
            backdrop-blur-xl
            sm:px-6
            lg:px-7
            lg:grid
            lg:grid-cols-[auto_1fr_auto]
          "
        >
          {/* =================================================
              BRAND
          ================================================= */}
          <Link
            href="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center gap-3"
          >
            {/* LOGO */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-14 sm:w-14">
              {!logoError ? (
                <Image
                  src="/Krupali-Traders-Logo.gif"
                  alt="Krupali Traders Private Limited"
                  fill
                  priority
                  sizes="56px"
                  className="object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#d6a638]
                    bg-[#0d1b2e]
                    text-xl
                    font-black
                    text-[#d6a638]
                  "
                >
                  K
                </div>
              )}
            </div>

            {/* COMPANY NAME */}
            <div className="hidden sm:block">
              <div className="text-[16px] font-black leading-tight tracking-wide text-[var(--foreground)]">
                KRUPALI TRADERS
              </div>

              <div className="mt-1 text-[14px] font-bold leading-tight tracking-wide text-[#d6a638]">
                PRIVATE LIMITED
              </div>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
              3-column grid keeps the menu truly centered:
              LEFT = Logo | CENTER = Menu | RIGHT = Controls
          ================================================= */}
          <div className="hidden lg:contents">
            {/* CENTER NAVIGATION */}
            <div className="col-start-2 flex items-center justify-center gap-6 xl:gap-7">

            {/* HOME */}
            <Link
              href="/"
              className="
                text-sm
                font-semibold
                text-[var(--foreground)]/75
                transition
                hover:text-blue-600
              "
            >
              {t("home")}
            </Link>

            {/* ABOUT */}
            <Link
              href="/about"
              className="
                text-sm
                font-semibold
                text-[var(--foreground)]/75
                transition
                hover:text-blue-600
              "
            >
              {t("about")}
            </Link>

            {/* PRODUCTS */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProductsOpen((value) => !value)
                }
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-semibold
                  text-[var(--foreground)]/75
                  transition
                  hover:text-blue-600
                "
              >
                {t("products")}

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {productsOpen && (
                <div
                  className="
                    absolute
                    left-1/2
                    top-full
                    z-50
                    mt-4
                    w-56
                    -translate-x-1/2
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-2
                    shadow-2xl
                  "
                >
                  <Link
                    href="/products/import"
                    onClick={() => setProductsOpen(false)}
                    className="
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[var(--foreground)]/80
                      transition
                      hover:bg-blue-500/10
                      hover:text-blue-600
                    "
                  >
                    {t("importProducts")}
                  </Link>

                  <Link
                    href="/products/export"
                    onClick={() => setProductsOpen(false)}
                    className="
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[var(--foreground)]/80
                      transition
                      hover:bg-blue-500/10
                      hover:text-blue-600
                    "
                  >
                    {t("exportProducts")}
                  </Link>
                </div>
              )}
            </div>

            {/* GALLERY */}
            <Link
              href="/gallery"
              className="
                text-sm
                font-semibold
                text-[var(--foreground)]/75
                transition
                hover:text-blue-600
              "
            >
              {t("gallery")}
            </Link>

            {/* BLOG */}
            <Link
              href="/blog"
              className="
                text-sm
                font-semibold
                text-[var(--foreground)]/75
                transition
                hover:text-blue-600
              "
            >
              {t("blog")}
            </Link>

            {/* CONTACT */}
            <Link
              href="/contact"
              className="
                text-sm
                font-semibold
                text-[var(--foreground)]/75
                transition
                hover:text-blue-600
              "
            >
              {t("contact")}
            </Link>

            </div>

            {/* =================================================
                RIGHT-SIDE CONTROLS
            ================================================= */}
            <div className="col-start-3 flex items-center justify-end gap-3">

            {/* =================================================
                LANGUAGE SELECTOR
            ================================================= */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setLanguageOpen((value) => !value)
                }
                aria-label="Select language"
                aria-expanded={languageOpen}
                className="
                  flex
                  h-11
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  px-3
                  text-sm
                  font-bold
                  text-[var(--foreground)]
                  transition
                  hover:border-blue-500/40
                  hover:bg-blue-500/5
                "
              >
                <Globe className="h-4 w-4" />

                <span>
                  {currentLanguage.code.toUpperCase()}
                </span>

                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close language selector"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setLanguageOpen(false)}
                  />

                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      z-50
                      mt-3
                      w-56
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      p-2
                      shadow-2xl
                    "
                  >
                    <div className="px-3 py-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--foreground)]/40">
                        {t("language")}
                      </p>
                    </div>

                    {languages.map((language) => {
                      const active =
                        language.code === locale;

                      return (
                        <button
                          key={language.code}
                          type="button"
                          onClick={() =>
                            changeLanguage(language.code)
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            transition
                            ${
                              active
                                ? "bg-blue-500/10 text-blue-600"
                                : "text-[var(--foreground)] hover:bg-blue-500/5"
                            }
                          `}
                        >
                          <span className="text-lg">
                            {language.flag}
                          </span>

                          <span className="flex-1">
                            <span className="block text-sm font-bold">
                              {language.nativeLabel}
                            </span>

                            <span className="block text-[11px] text-[var(--foreground)]/40">
                              {language.label}
                            </span>
                          </span>

                          {active && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* =================================================
                THEME BUTTON
            ================================================= */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--foreground)]
                transition
                hover:border-blue-500/40
                hover:text-blue-600
              "
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* =================================================
                GET QUOTE
            ================================================= */}
            <Link
              href="/request-quote"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-blue-500
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition
                hover:-translate-y-0.5
                hover:shadow-blue-600/30
              "
            >
              {t("getQuote")}

              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          </div>

          {/* =================================================
              MOBILE CONTROLS
          ================================================= */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">

            {/* LANGUAGE */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setLanguageOpen((value) => !value)
                }
                className="
                  flex
                  h-10
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  px-3
                  text-xs
                  font-black
                  text-[var(--foreground)]
                "
              >
                <Globe className="h-4 w-4" />

                {currentLanguage.code.toUpperCase()}
              </button>

              {languageOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    z-50
                    mt-3
                    w-52
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-2
                    shadow-2xl
                  "
                >
                  {languages.map((language) => {
                    const active =
                      language.code === locale;

                    return (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() =>
                          changeLanguage(language.code)
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          ${
                            active
                              ? "bg-blue-500/10 text-blue-600"
                              : "text-[var(--foreground)] hover:bg-blue-500/5"
                          }
                        `}
                      >
                        <span className="text-lg">
                          {language.flag}
                        </span>

                        <span className="flex-1 text-sm font-bold">
                          {language.nativeLabel}
                        </span>

                        {active && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* THEME */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--foreground)]
              "
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* MENU */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen((value) => !value)
              }
              aria-label="Toggle navigation menu"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--foreground)]
              "
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}
        {mobileOpen && (
          <div className="mx-auto mt-3 max-w-[1400px] lg:hidden">
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-[var(--border)]
                bg-[var(--surface)]/98
                p-4
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <div className="flex flex-col gap-1">

                <Link
                  href="/"
                  onClick={closeMenus}
                  className="rounded-2xl px-4 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-blue-500/10"
                >
                  {t("home")}
                </Link>

                <Link
                  href="/about"
                  onClick={closeMenus}
                  className="rounded-2xl px-4 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-blue-500/10"
                >
                  {t("about")}
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setProductsOpen((value) => !value)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    px-4
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                    hover:bg-blue-500/10
                  "
                >
                  {t("products")}

                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      productsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {productsOpen && (
                  <div className="ml-4 border-l border-[var(--border)] pl-3">
                    <Link
                      href="/products/import"
                      onClick={closeMenus}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-[var(--foreground)]/70 hover:bg-blue-500/10"
                    >
                      {t("importProducts")}
                    </Link>

                    <Link
                      href="/products/export"
                      onClick={closeMenus}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-[var(--foreground)]/70 hover:bg-blue-500/10"
                    >
                      {t("exportProducts")}
                    </Link>
                  </div>
                )}

                <Link
                  href="/gallery"
                  onClick={closeMenus}
                  className="rounded-2xl px-4 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-blue-500/10"
                >
                  {t("gallery")}
                </Link>

                <Link
                  href="/blog"
                  onClick={closeMenus}
                  className="rounded-2xl px-4 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-blue-500/10"
                >
                  {t("blog")}
                </Link>

                <Link
                  href="/contact"
                  onClick={closeMenus}
                  className="rounded-2xl px-4 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-blue-500/10"
                >
                  {t("contact")}
                </Link>

                <Link
                  href="/request-quote"
                  onClick={closeMenus}
                  className="
                    mt-2
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-blue-500
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {t("getQuote")}

                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Keep space only on pages without a full-screen hero. */}
      {pathname !== "/" && pathname !== "/about" && <div className="h-[105px]" />}
    </>
  );
}