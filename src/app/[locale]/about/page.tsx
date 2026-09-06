import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Globe2,
  ShieldCheck,
  Target,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <main className="gradient-section overflow-hidden">
      {/* =====================================================
          FULL-SCREEN VIDEO HERO
          Starts at the top so there is no extra blank space.
      ===================================================== */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/about-hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/krupali-trade.mp4" type="video/mp4" />
        </video>

        {/* Subtle readability gradient only at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03101f]/90 via-[#03101f]/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-7xl px-5 pb-10 text-center sm:px-8 sm:pb-14 lg:pb-16">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#d8b45b]">
              {t("heroTag")}
            </div>

            <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {t("heroTitle1")}
              <span className="block text-[#68b0ff]">{t("heroTitle2")}</span>
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              {t("heroDesc")}
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#d8b45b] px-7 py-3 font-semibold text-[#07111f] transition hover:-translate-y-1 hover:bg-[#e6c66f] hover:shadow-xl"
              >
                {t("workWithUs")}
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-black/10 px-7 py-3 font-semibold text-white backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10"
              >
                {t("exploreProducts")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE VALUES
      ===================================================== */}
      <section className="px-5 pb-24 pt-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="gradient-card gradient-border rounded-3xl p-6 sm:p-8">
              <Globe2
                className="text-[#1455a0] dark:text-[#68b0ff]"
                size={28}
              />
              <h2 className="mt-6 text-xl font-bold text-[var(--foreground)]">
                {t("globalApproach")}
              </h2>
              <p className="mt-3 leading-7 text-[var(--foreground)]/60">
                {t("globalApproachDesc")}
              </p>
            </div>

            <div className="gradient-card gradient-border rounded-3xl p-6 sm:p-8">
              <ShieldCheck
                className="text-[#1455a0] dark:text-[#68b0ff]"
                size={28}
              />
              <h2 className="mt-6 text-xl font-bold text-[var(--foreground)]">
                {t("trustedTrade")}
              </h2>
              <p className="mt-3 leading-7 text-[var(--foreground)]/60">
                {t("trustedTradeDesc")}
              </p>
            </div>

            <div className="gradient-card gradient-border rounded-3xl p-6 sm:p-8">
              <Target
                className="text-[#1455a0] dark:text-[#68b0ff]"
                size={28}
              />
              <h2 className="mt-6 text-xl font-bold text-[var(--foreground)]">
                {t("qualityFocus")}
              </h2>
              <p className="mt-3 leading-7 text-[var(--foreground)]/60">
                {t("qualityFocusDesc")}
              </p>
            </div>
          </div>

          {/* =================================================
              OUR APPROACH
          ================================================= */}
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#07111f] via-[#0b3266] to-[#1455a0] p-8 text-white shadow-[0_25px_70px_rgba(20,85,160,0.15)] lg:p-12">
            <div className="max-w-3xl">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#d8b45b]">
                {t("approachTag")}
              </div>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                {t("approachTitle")}
              </h2>

              <p className="mt-6 leading-8 text-white/70">
                {t("approachDesc")}
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#0b3266] transition hover:-translate-y-1 hover:shadow-lg"
              >
                {t("contactBtn")}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
