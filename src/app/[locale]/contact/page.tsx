"use client";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type ProductType = "IMPORT" | "EXPORT";

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      country: String(formData.get("country") || ""),
      productName: String(
        formData.get("productName") || ""
      ),
      productType: String(
        formData.get("productType") || ""
      ) as ProductType,
      quantity: String(
        formData.get("quantity") || ""
      ),
      message: String(
        formData.get("message") || ""
      ),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(t("submitError"));
      }

      setSuccess(t("successMessage"));

      form.reset();
    } catch {
      setError(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="gradient-section text-[var(--foreground)]">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden px-5 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">

          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#c9a24d] dark:text-[#d8b45b]">
            {t("tag")}
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            <span className="gradient-text">
              {t("title")}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--foreground)]/65">
            {t("description")}
          </p>

        </div>
      </section>

      {/* =====================================================
          CONTACT + BUSINESS ENQUIRY
      ===================================================== */}
      <section className="px-5 pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}
          <div className="gradient-card gradient-border rounded-[2rem] p-8 lg:p-10">

            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              {t("getInTouch")}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--foreground)]/55">
              {t("getInTouchDescription")}
            </p>

            <div className="mt-8 space-y-6">

              {/* LOCATION */}
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[#1455a0] dark:text-[#68b0ff]">
                  <MapPin size={20} />
                </div>

                <div>
                  <div className="font-semibold text-[var(--foreground)]">
                    {t("location")}
                  </div>

                  <div className="mt-1 text-sm text-[var(--foreground)]/60">
                    Gujarat, India
                  </div>
                </div>

              </div>

              {/* PHONE */}
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[#1455a0] dark:text-[#68b0ff]">
                  <Phone size={20} />
                </div>

                <div>
                  <div className="font-semibold text-[var(--foreground)]">
                    {t("phone")}
                  </div>

                  <div className="mt-1 text-sm text-[var(--foreground)]/60">
                    +91 96010 90109
                  </div>
                </div>

              </div>

              {/* EMAIL */}
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[#1455a0] dark:text-[#68b0ff]">
                  <Mail size={20} />
                </div>

                <div>
                  <div className="font-semibold text-[var(--foreground)]">
                    {t("email")}
                  </div>

                  <div className="mt-1 text-sm text-[var(--foreground)]/60">
                    krupalitraderss@gmail.com
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* =================================================
              BUSINESS ENQUIRY
          ================================================= */}
          <div
            className="
              rounded-[2rem]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-6
              text-[var(--foreground)]
              shadow-[0_20px_60px_rgba(20,85,160,0.08)]
              sm:p-8
              lg:p-10

              dark:border-white/20
              dark:bg-gradient-to-br
              dark:from-[#07111f]
              dark:via-[#0b3266]
              dark:to-[#1455a0]
              dark:text-white
              dark:shadow-[0_25px_70px_rgba(0,0,0,0.35)]
            "
          >

            {/* HEADING */}
            <div className="text-center text-sm font-bold uppercase tracking-[0.2em] text-[#c9a24d] dark:text-[#d8b45b]">
              {t("businessEnquiry")}
            </div>

            <h2 className="mt-4 text-center text-3xl font-bold text-[var(--foreground)] dark:text-white">
              {t("tellUs")}
            </h2>

            <p className="mt-5 leading-7 text-[var(--foreground)]/65 dark:text-white/65">
              {t("enquiryDescription")}
            </p>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <span>{success}</span>

              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-100">
                {error}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* NAME / COMPANY */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("name")} *
                  </label>

                  <input
                    id="name"
                    name="name"
                    required
                    placeholder={t("namePlaceholder")}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      placeholder:text-[var(--foreground)]/40
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                      dark:placeholder:text-white/35
                      dark:focus:border-white/40
                      dark:focus:ring-white/10
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("company")}
                  </label>

                  <input
                    id="company"
                    name="company"
                    placeholder={t("companyPlaceholder")}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      placeholder:text-[var(--foreground)]/40
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                      dark:placeholder:text-white/35
                      dark:focus:border-white/40
                      dark:focus:ring-white/10
                    "
                  />
                </div>

              </div>

              {/* EMAIL / PHONE */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("email")} *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t("emailPlaceholder")}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      placeholder:text-[var(--foreground)]/40
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                      dark:placeholder:text-white/35
                      dark:focus:border-white/40
                      dark:focus:ring-white/10
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("phone")}
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t("phonePlaceholder")}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      placeholder:text-[var(--foreground)]/40
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                      dark:placeholder:text-white/35
                      dark:focus:border-white/40
                    "
                  />
                </div>

              </div>

              {/* COUNTRY / REQUIREMENT TYPE */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("country")}
                  </label>

                  <input
                    id="country"
                    name="country"
                    placeholder={t("countryPlaceholder")}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      placeholder:text-[var(--foreground)]/40
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                      dark:placeholder:text-white/35
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="productType"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("requirementType")} *
                  </label>

                  <select
                    id="productType"
                    name="productType"
                    required
                    defaultValue=""
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-[#0b3266]
                      dark:text-white
                    "
                  >
                    <option
                      value=""
                      disabled
                    >
                      {t("selectType")}
                    </option>

                    <option value="IMPORT">
                      {t("import")}
                    </option>

                    <option value="EXPORT">
                      {t("export")}
                    </option>
                  </select>
                </div>

              </div>

              {/* PRODUCT / QUANTITY */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="productName"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("product")} *
                  </label>

                  <input
                    id="productName"
                    name="productName"
                    required
                    placeholder={t("productPlaceholder")}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      placeholder:text-[var(--foreground)]/40
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                      dark:placeholder:text-white/35
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                  >
                    {t("quantity")}
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    placeholder={t("quantityPlaceholder")}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      px-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      placeholder:text-[var(--foreground)]/40
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/10
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                      dark:placeholder:text-white/35
                    "
                  />
                </div>

              </div>

              {/* MESSAGE */}
              <div>

                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-[var(--foreground)]/80 dark:text-white/85"
                >
                  {t("message")}
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t("messagePlaceholder")}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface-soft)]
                    px-4
                    py-3
                    text-sm
                    text-[var(--foreground)]
                    outline-none
                    placeholder:text-[var(--foreground)]/40
                    focus:border-[var(--primary)]
                    focus:ring-2
                    focus:ring-[var(--primary)]/10
                    dark:border-white/15
                    dark:bg-white/10
                    dark:text-white
                    dark:placeholder:text-white/35
                  "
                />

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[var(--primary)]
                  px-6
                  py-3.5
                  font-semibold
                  text-white
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-dark)]
                  hover:shadow-lg
                  dark:bg-white
                  dark:text-[#0b3266]
                  dark:hover:bg-white/90
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    {t("submit")}
                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>

          </div>

        </div>
      </section>

    </main>
  );
}