"use client";

import { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

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

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const currentLanguage =
    languages.find((language) => language.code === locale) ||
    languages[0];

  function changeLanguage(newLocale: string) {
    setOpen(false);

    if (newLocale === locale) {
      return;
    }

    router.replace(pathname, {
      locale: newLocale,
    });
  }

  return (
    <div className="relative">
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
              w-52
              overflow-hidden
              rounded-2xl
              border border-[var(--border)]
              bg-[var(--surface)]
              p-2
              shadow-2xl
              shadow-black/15
            "
          >
            <div className="px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--foreground)]/40">
                Language
              </p>
            </div>

            {languages.map((language) => {
              const active = language.code === locale;

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => changeLanguage(language.code)}
                  className={`
                    flex w-full items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-left
                    transition
                    ${
                      active
                        ? "bg-blue-500/10 text-blue-600"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-soft)]"
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
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}