"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Search, X } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

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

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLanguage =
    languages.find((language) => language.code === locale) ||
    languages[0];

  const filteredLanguages = languages.filter((language) => {
    const query = search.trim().toLowerCase();

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
    setOpen(false);
    setSearch("");

    if (newLocale === locale) {
      return;
    }

    router.replace(pathname, {
      locale: newLocale,
    });
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      {/* LANGUAGE BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Select language"
        aria-expanded={open}
        className="
          inline-flex items-center gap-2
          rounded-full
          border border-[var(--border)]
          bg-[var(--surface)]
          px-3 py-2
          text-sm font-semibold
          text-[var(--foreground)]
          shadow-sm
          transition
          hover:border-blue-500/40
          hover:bg-blue-500/5
        "
      >
        <Globe className="h-4 w-4" />

        <span
          className={`fi fi-${currentLanguage.flag}`}
          style={{
            width: "20px",
            height: "14px",
            display: "inline-block",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />

        <span className="hidden sm:inline">
          {currentLanguage.code.toUpperCase()}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <>
          {/* Click outside */}
          <button
            type="button"
            aria-label="Close language menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

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
              border border-[var(--border)]
              bg-[var(--surface)]
              shadow-2xl
              shadow-black/20
            "
          >
            {/* HEADER */}
            <div className="border-b border-[var(--border)] p-3">
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
                  Select Language
                </p>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="
                    rounded-full
                    p-1
                    text-[var(--foreground)]/50
                    transition
                    hover:bg-[var(--surface-soft)]
                    hover:text-[var(--foreground)]
                  "
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
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
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search language..."
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
            <div className="max-h-[420px] overflow-y-auto p-2">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => {
                  const active = language.code === locale;

                  return (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => changeLanguage(language.code)}
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
                            : "hover:bg-[var(--surface-soft)]"
                        }
                      `}
                    >
                      {/* FLAG */}
                      <span
                        className={`fi fi-${language.flag}`}
                        style={{
                          width: "24px",
                          height: "16px",
                          display: "inline-block",
                          flexShrink: 0,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        aria-hidden="true"
                      />

                      {/* LANGUAGE */}
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

                      {/* LANGUAGE CODE */}
                      <span
                        className="
                          hidden
                          text-[10px]
                          font-bold
                          uppercase
                          text-[var(--foreground)]/30
                          sm:block
                        "
                      >
                        {language.code}
                      </span>

                      {/* ACTIVE CHECK */}
                      {active && (
                        <Check className="h-4 w-4 shrink-0 text-blue-600" />
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

            {/* FOOTER */}
            <div
              className="
                border-t
                border-[var(--border)]
                px-3
                py-2
              "
            >
              <p className="text-center text-[10px] text-[var(--foreground)]/35">
                {languages.length} languages available
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}