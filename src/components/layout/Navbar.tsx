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
  Search,
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
    flag: "gb",
  },
  {
    code: "gu",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    flag: "in",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    flag: "in",
  },
  {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    flag: "sa",
  },
  {
    code: "af",
    label: "Afrikaans",
    nativeLabel: "Afrikaans",
    flag: "za",
  },
  {
    code: "sq",
    label: "Albanian",
    nativeLabel: "Shqip",
    flag: "al",
  },
  {
    code: "am",
    label: "Amharic",
    nativeLabel: "አማርኛ",
    flag: "et",
  },
  {
    code: "hy",
    label: "Armenian",
    nativeLabel: "Հայերեն",
    flag: "am",
  },
  {
    code: "az",
    label: "Azerbaijani",
    nativeLabel: "Azərbaycan",
    flag: "az",
  },
  {
    code: "be",
    label: "Belarusian",
    nativeLabel: "Беларуская",
    flag: "by",
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
    flag: "bd",
  },
  {
    code: "bs",
    label: "Bosnian",
    nativeLabel: "Bosanski",
    flag: "ba",
  },
  {
    code: "bg",
    label: "Bulgarian",
    nativeLabel: "Български",
    flag: "bg",
  },
  {
    code: "ca",
    label: "Catalan",
    nativeLabel: "Català",
    flag: "es",
  },
  {
    code: "zh-CN",
    label: "Chinese (Simplified)",
    nativeLabel: "简体中文",
    flag: "cn",
  },
  {
    code: "zh-TW",
    label: "Chinese (Traditional)",
    nativeLabel: "繁體中文",
    flag: "tw",
  },
  {
    code: "hr",
    label: "Croatian",
    nativeLabel: "Hrvatski",
    flag: "hr",
  },
  {
    code: "cs",
    label: "Czech",
    nativeLabel: "Čeština",
    flag: "cz",
  },
  {
    code: "da",
    label: "Danish",
    nativeLabel: "Dansk",
    flag: "dk",
  },
  {
    code: "nl",
    label: "Dutch",
    nativeLabel: "Nederlands",
    flag: "nl",
  },
  {
    code: "et",
    label: "Estonian",
    nativeLabel: "Eesti",
    flag: "ee",
  },
  {
    code: "fi",
    label: "Finnish",
    nativeLabel: "Suomi",
    flag: "fi",
  },
  {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    flag: "fr",
  },
  {
    code: "ka",
    label: "Georgian",
    nativeLabel: "ქართული",
    flag: "ge",
  },
  {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    flag: "de",
  },
  {
    code: "el",
    label: "Greek",
    nativeLabel: "Ελληνικά",
    flag: "gr",
  },
  {
    code: "ht",
    label: "Haitian Creole",
    nativeLabel: "Kreyòl Ayisyen",
    flag: "ht",
  },
  {
    code: "he",
    label: "Hebrew",
    nativeLabel: "עברית",
    flag: "il",
  },
  {
    code: "hu",
    label: "Hungarian",
    nativeLabel: "Magyar",
    flag: "hu",
  },
  {
    code: "is",
    label: "Icelandic",
    nativeLabel: "Íslenska",
    flag: "is",
  },
  {
    code: "id",
    label: "Indonesian",
    nativeLabel: "Bahasa Indonesia",
    flag: "id",
  },
  {
    code: "ga",
    label: "Irish",
    nativeLabel: "Gaeilge",
    flag: "ie",
  },
  {
    code: "it",
    label: "Italian",
    nativeLabel: "Italiano",
    flag: "it",
  },
  {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    flag: "jp",
  },
  {
    code: "kk",
    label: "Kazakh",
    nativeLabel: "Қазақша",
    flag: "kz",
  },
  {
    code: "km",
    label: "Khmer",
    nativeLabel: "ខ្មែរ",
    flag: "kh",
  },
  {
    code: "ko",
    label: "Korean",
    nativeLabel: "한국어",
    flag: "kr",
  },
  {
    code: "ky",
    label: "Kyrgyz",
    nativeLabel: "Кыргызча",
    flag: "kg",
  },
  {
    code: "lo",
    label: "Lao",
    nativeLabel: "ລາວ",
    flag: "la",
  },
  {
    code: "lv",
    label: "Latvian",
    nativeLabel: "Latviešu",
    flag: "lv",
  },
  {
    code: "lt",
    label: "Lithuanian",
    nativeLabel: "Lietuvių",
    flag: "lt",
  },
  {
    code: "lb",
    label: "Luxembourgish",
    nativeLabel: "Lëtzebuergesch",
    flag: "lu",
  },
  {
    code: "mk",
    label: "Macedonian",
    nativeLabel: "Македонски",
    flag: "mk",
  },
  {
    code: "mg",
    label: "Malagasy",
    nativeLabel: "Malagasy",
    flag: "mg",
  },
  {
    code: "ms",
    label: "Malay",
    nativeLabel: "Bahasa Melayu",
    flag: "my",
  },
  {
    code: "mt",
    label: "Maltese",
    nativeLabel: "Malti",
    flag: "mt",
  },
  {
    code: "mi",
    label: "Māori",
    nativeLabel: "Te Reo Māori",
    flag: "nz",
  },
  {
    code: "ne",
    label: "Nepali",
    nativeLabel: "नेपाली",
    flag: "np",
  },
  {
    code: "no",
    label: "Norwegian",
    nativeLabel: "Norsk",
    flag: "no",
  },
  {
    code: "fa",
    label: "Persian",
    nativeLabel: "فارسی",
    flag: "ir",
  },
  {
    code: "fil",
    label: "Filipino",
    nativeLabel: "Filipino",
    flag: "ph",
  },
  {
    code: "pl",
    label: "Polish",
    nativeLabel: "Polski",
    flag: "pl",
  },
  {
    code: "pt",
    label: "Portuguese",
    nativeLabel: "Português",
    flag: "pt",
  },
  {
    code: "ro",
    label: "Romanian",
    nativeLabel: "Română",
    flag: "ro",
  },
  {
    code: "ru",
    label: "Russian",
    nativeLabel: "Русский",
    flag: "ru",
  },
  {
    code: "sr",
    label: "Serbian",
    nativeLabel: "Српски",
    flag: "rs",
  },
  {
    code: "si",
    label: "Sinhala",
    nativeLabel: "සිංහල",
    flag: "lk",
  },
  {
    code: "sk",
    label: "Slovak",
    nativeLabel: "Slovenčina",
    flag: "sk",
  },
  {
    code: "sl",
    label: "Slovenian",
    nativeLabel: "Slovenščina",
    flag: "si",
  },
  {
    code: "so",
    label: "Somali",
    nativeLabel: "Soomaali",
    flag: "so",
  },
  {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    flag: "es",
  },
  {
    code: "sw",
    label: "Swahili",
    nativeLabel: "Kiswahili",
    flag: "ke",
  },
  {
    code: "sv",
    label: "Swedish",
    nativeLabel: "Svenska",
    flag: "se",
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    flag: "in",
  },
  {
    code: "th",
    label: "Thai",
    nativeLabel: "ไทย",
    flag: "th",
  },
  {
    code: "tr",
    label: "Turkish",
    nativeLabel: "Türkçe",
    flag: "tr",
  },
  {
    code: "uk",
    label: "Ukrainian",
    nativeLabel: "Українська",
    flag: "ua",
  },
  {
    code: "ur",
    label: "Urdu",
    nativeLabel: "اردو",
    flag: "pk",
  },
  {
    code: "uz",
    label: "Uzbek",
    nativeLabel: "Oʻzbekcha",
    flag: "uz",
  },
  {
    code: "vi",
    label: "Vietnamese",
    nativeLabel: "Tiếng Việt",
    flag: "vn",
  },
  {
    code: "cy",
    label: "Welsh",
    nativeLabel: "Cymraeg",
    flag: "gb",
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
  const [languageSearch, setLanguageSearch] = useState("");
  const [logoError, setLogoError] = useState(false);

  const currentLanguage =
    languages.find((item) => item.code === locale) ??
    languages[0];

  const filteredLanguages = languages.filter((language) => {
    const query = languageSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      language.label.toLowerCase().includes(query) ||
      language.nativeLabel.toLowerCase().includes(query) ||
      language.code.toLowerCase().includes(query)
    );
  });

  function changeLanguage(newLocale: string) {
    setLanguageOpen(false);
    setLanguageSearch("");
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
    setLanguageSearch("");
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

              {/* LANGUAGE SELECTOR */}
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

                  <span
                    className={`fi fi-${currentLanguage.flag}`}
                    aria-hidden="true"
                  />

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
                    {/* CLICK OUTSIDE */}
                    <button
                      type="button"
                      aria-label="Close language selector"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => {
                        setLanguageOpen(false);
                        setLanguageSearch("");
                      }}
                    />

                    {/* LANGUAGE DROPDOWN */}
                    <div
                      className="
                        absolute
                        right-0
                        top-full
                        z-50
                        mt-3
                        w-[320px]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        shadow-2xl
                        shadow-black/20
                      "
                    >
                      {/* HEADER */}
                      <div
                        className="
                          border-b
                          border-[var(--border)]
                          p-3
                        "
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p
                            className="
                              text-[10px]
                              font-black
                              uppercase
                              tracking-[0.18em]
                              text-[var(--foreground)]/50
                            "
                          >
                            {t("language")}
                          </p>

                          <span className="text-[10px] font-semibold text-[var(--foreground)]/35">
                            {languages.length} languages
                          </span>
                        </div>

                        {/* SEARCH */}
                        <div className="relative">
                          <Search
                            className="
                              absolute
                              left-3
                              top-1/2
                              h-4
                              w-4
                              -translate-y-1/2
                              text-[var(--foreground)]/40
                            "
                          />

                          <input
                            type="text"
                            value={languageSearch}
                            onChange={(event) =>
                              setLanguageSearch(event.target.value)
                            }
                            placeholder="Search language..."
                            autoFocus
                            className="
                              w-full
                              rounded-xl
                              border
                              border-[var(--border)]
                              bg-[var(--surface-soft)]
                              py-2.5
                              pl-9
                              pr-3
                              text-sm
                              text-[var(--foreground)]
                              outline-none
                              placeholder:text-[var(--foreground)]/40
                              focus:border-blue-500/50
                              focus:ring-2
                              focus:ring-blue-500/10
                            "
                          />
                        </div>
                      </div>

                      {/* LANGUAGE LIST */}
                      <div className="max-h-[430px] overflow-y-auto p-2">
                        {filteredLanguages.length > 0 ? (
                          filteredLanguages.map((language) => {
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
                                  py-2.5
                                  text-left
                                  transition
                                  ${
                                    active
                                      ? "bg-blue-500/10"
                                      : "hover:bg-blue-500/5"
                                  }
                                `}
                              >
                                {/* FLAG */}
                                <span
                                  className={`fi fi-${language.flag}`}
                                  aria-hidden="true"
                                />

                                {/* NAME */}
                                <span className="min-w-0 flex-1">
                                  <span
                                    className={`
                                      block
                                      truncate
                                      text-sm
                                      font-bold
                                      ${
                                        active
                                          ? "text-blue-600"
                                          : "text-[var(--foreground)]"
                                      }
                                    `}
                                  >
                                    {language.nativeLabel}
                                  </span>

                                  <span
                                    className="
                                      block
                                      truncate
                                      text-[11px]
                                      text-[var(--foreground)]/40
                                    "
                                  >
                                    {language.label}
                                  </span>
                                </span>

                                {/* CODE */}
                                <span
                                  className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    text-[var(--foreground)]/30
                                  "
                                >
                                  {language.code}
                                </span>

                                {/* CHECK */}
                                {active && (
                                  <Check
                                    className="
                                      h-4
                                      w-4
                                      shrink-0
                                      text-blue-600
                                    "
                                  />
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div
                            className="
                              px-4
                              py-10
                              text-center
                              text-sm
                              text-[var(--foreground)]/50
                            "
                          >
                            No language found
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* THEME BUTTON */}
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

              {/* GET QUOTE */}
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
                aria-label="Select language"
                aria-expanded={languageOpen}
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

                <span
                  className={`fi fi-${currentLanguage.flag}`}
                  aria-hidden="true"
                />

                {currentLanguage.code.toUpperCase()}
              </button>

              {languageOpen && (
                <>
                  {/* CLICK OUTSIDE */}
                  <button
                    type="button"
                    aria-label="Close language selector"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => {
                      setLanguageOpen(false);
                      setLanguageSearch("");
                    }}
                  />

                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      z-50
                      mt-3
                      w-[300px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      shadow-2xl
                      shadow-black/20
                    "
                  >
                    {/* HEADER */}
                    <div
                      className="
                        border-b
                        border-[var(--border)]
                        p-3
                      "
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-[var(--foreground)]/50
                          "
                        >
                          {t("language")}
                        </p>

                        <span className="text-[10px] font-semibold text-[var(--foreground)]/35">
                          {languages.length}
                        </span>
                      </div>

                      {/* SEARCH */}
                      <div className="relative">
                        <Search
                          className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-[var(--foreground)]/40
                          "
                        />

                        <input
                          type="text"
                          value={languageSearch}
                          onChange={(event) =>
                            setLanguageSearch(event.target.value)
                          }
                          placeholder="Search language..."
                          autoFocus
                          className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface-soft)]
                            py-2.5
                            pl-9
                            pr-3
                            text-sm
                            text-[var(--foreground)]
                            outline-none
                            placeholder:text-[var(--foreground)]/40
                            focus:border-blue-500/50
                            focus:ring-2
                            focus:ring-blue-500/10
                          "
                        />
                      </div>
                    </div>

                    {/* LANGUAGE LIST */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {filteredLanguages.length > 0 ? (
                        filteredLanguages.map((language) => {
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
                                    ? "bg-blue-500/10"
                                    : "hover:bg-blue-500/5"
                                }
                              `}
                            >
                              {/* FLAG */}
                              <span
                                className={`fi fi-${language.flag}`}
                                aria-hidden="true"
                              />

                              {/* NAME */}
                              <span className="min-w-0 flex-1">
                                <span
                                  className={`
                                    block
                                    truncate
                                    text-sm
                                    font-bold
                                    ${
                                      active
                                        ? "text-blue-600"
                                        : "text-[var(--foreground)]"
                                    }
                                  `}
                                >
                                  {language.nativeLabel}
                                </span>

                                <span
                                  className="
                                    block
                                    truncate
                                    text-[11px]
                                    text-[var(--foreground)]/40
                                  "
                                >
                                  {language.label}
                                </span>
                              </span>

                              {/* CODE */}
                              <span
                                className="
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  text-[var(--foreground)]/30
                                "
                              >
                                {language.code}
                              </span>

                              {/* CHECK */}
                              {active && (
                                <Check
                                  className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-blue-600
                                  "
                                />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div
                          className="
                            px-4
                            py-10
                            text-center
                            text-sm
                            text-[var(--foreground)]/50
                          "
                        >
                          No language found
                        </div>
                      )}
                    </div>
                  </div>
                </>
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

                {/* HOME */}
                <Link
                  href="/"
                  onClick={closeMenus}
                  className="
                    rounded-2xl
                    px-4
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                    hover:bg-blue-500/10
                  "
                >
                  {t("home")}
                </Link>

                {/* ABOUT */}
                <Link
                  href="/about"
                  onClick={closeMenus}
                  className="
                    rounded-2xl
                    px-4
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                    hover:bg-blue-500/10
                  "
                >
                  {t("about")}
                </Link>

                {/* PRODUCTS */}
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
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-[var(--foreground)]/70
                        hover:bg-blue-500/10
                      "
                    >
                      {t("importProducts")}
                    </Link>

                    <Link
                      href="/products/export"
                      onClick={closeMenus}
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-[var(--foreground)]/70
                        hover:bg-blue-500/10
                      "
                    >
                      {t("exportProducts")}
                    </Link>
                  </div>
                )}

                {/* GALLERY */}
                <Link
                  href="/gallery"
                  onClick={closeMenus}
                  className="
                    rounded-2xl
                    px-4
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                    hover:bg-blue-500/10
                  "
                >
                  {t("gallery")}
                </Link>

                {/* BLOG */}
                <Link
                  href="/blog"
                  onClick={closeMenus}
                  className="
                    rounded-2xl
                    px-4
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                    hover:bg-blue-500/10
                  "
                >
                  {t("blog")}
                </Link>

                {/* CONTACT */}
                <Link
                  href="/contact"
                  onClick={closeMenus}
                  className="
                    rounded-2xl
                    px-4
                    py-3.5
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                    hover:bg-blue-500/10
                  "
                >
                  {t("contact")}
                </Link>

                {/* GET QUOTE */}
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
      {pathname !== "/" && pathname !== "/about" && (
        <div className="h-[105px]" />
      )}
    </>
  );
}