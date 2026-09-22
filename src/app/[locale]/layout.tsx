import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
    >
      <ThemeProvider>
        <OrganizationJsonLd locale={locale} />

        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>

        <ChatbotWidget />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
