"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Globe,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

type Locale = "en" | "hi" | "gu";

type ChatMessage = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
};

const translations = {
  en: {
    title: "Krupali Trade Assistant",
    subtitle: "Online • Ready to help",
    greeting:
      "Hello! 👋 Welcome to Krupali Traders. I can help you with our products, import/export requirements, MOQ, packaging and quotation enquiries.",
    placeholder: "Type your message...",
    export: "Export Products",
    import: "Import Products",
    quote: "Request a Quote",
    products: "View Products",
    send: "Send",
    typing: "Thinking...",
    language: "Language",
    footer: "AI Trade Assistant",
  },

  hi: {
    title: "Krupali Trade Assistant",
    subtitle: "ऑनलाइन • सहायता के लिए तैयार",
    greeting:
      "नमस्ते! 👋 Krupali Traders में आपका स्वागत है। मैं हमारे उत्पादों, आयात/निर्यात, MOQ, पैकेजिंग और कोटेशन से जुड़ी जानकारी में आपकी मदद कर सकता हूँ।",
    placeholder: "अपना संदेश लिखें...",
    export: "निर्यात उत्पाद",
    import: "आयात उत्पाद",
    quote: "कोटेशन माँगें",
    products: "उत्पाद देखें",
    send: "भेजें",
    typing: "सोच रहा हूँ...",
    language: "भाषा",
    footer: "AI Trade Assistant",
  },

  gu: {
    title: "Krupali Trade Assistant",
    subtitle: "ઓનલાઇન • મદદ માટે તૈયાર",
    greeting:
      "નમસ્તે! 👋 Krupali Traders માં આપનું સ્વાગત છે. હું અમારા ઉત્પાદનો, આયાત/નિકાસ, MOQ, પેકેજિંગ અને કોટેશન સંબંધિત માહિતીમાં તમારી મદદ કરી શકું છું.",
    placeholder: "તમારો સંદેશ લખો...",
    export: "નિકાસ ઉત્પાદનો",
    import: "આયાત ઉત્પાદનો",
    quote: "કોટેશન માંગો",
    products: "ઉત્પાદનો જુઓ",
    send: "મોકલો",
    typing: "વિચાર કરી રહ્યો છું...",
    language: "ભાષા",
    footer: "AI Trade Assistant",
  },
};

const STORAGE_KEY = "krupali-chat-session";
const LOCALE_KEY = "krupali-chat-locale";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[locale];

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LOCALE_KEY);

    const validLocale: Locale =
      storedLocale === "hi" || storedLocale === "gu" ? storedLocale : "en";

    setLocale(validLocale);

    const storedSession = window.localStorage.getItem(STORAGE_KEY);

    if (!storedSession) {
      setMessages([
        {
          id: "welcome",
          role: "ASSISTANT",
          content: translations[validLocale].greeting,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function changeLocale(value: Locale) {
    setLocale(value);
    window.localStorage.setItem(LOCALE_KEY, value);

    setMessages((current) => {
      if (current.length === 1 && current[0].id === "welcome") {
        return [
          {
            id: "welcome",
            role: "ASSISTANT",
            content: translations[value].greeting,
          },
        ];
      }

      return current;
    });
  }

  async function sendMessage(text?: string) {
    const content = (text ?? message).trim();

    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "USER",
      content,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const sessionToken =
        window.localStorage.getItem(STORAGE_KEY) || undefined;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          sessionToken,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Chat request failed");
      }

      if (data.sessionToken) {
        window.localStorage.setItem(STORAGE_KEY, data.sessionToken);
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "ASSISTANT",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error("[CHATBOT]", error);

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "ASSISTANT",
          content:
            locale === "gu"
              ? "માફ કરશો, હાલમાં જવાબ આપવામાં સમસ્યા આવી રહી છે. કૃપા કરીને થોડી વાર પછી ફરી પ્રયાસ કરો."
              : locale === "hi"
                ? "क्षमा करें, अभी जवाब देने में समस्या हो रही है। कृपया थोड़ी देर बाद फिर प्रयास करें।"
                : "Sorry, I'm having trouble responding right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Krupali Traders chat"
          className="fixed bottom-5 right-5 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-orange-400/30" />
          <Bot className="relative h-8 w-8 stroke-[1.8]" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[9999] flex h-[min(680px,calc(100vh-40px))] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-5 text-white">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                  <Bot className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-semibold">{t.title}</h2>

                  <p className="mt-0.5 text-xs text-white/80">
                    <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-300" />
                    {t.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-xl p-2 transition hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-4 flex items-center justify-between rounded-xl bg-black/10 p-2">
              <div className="flex items-center gap-2 text-xs text-white/90">
                <Globe className="h-4 w-4" />
                {t.language}
              </div>

              <div className="flex gap-1">
                {(["en", "hi", "gu"] as Locale[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeLocale(item)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      locale === item
                        ? "bg-white text-orange-600"
                        : "text-white hover:bg-white/15"
                    }`}
                  >
                    {item === "en" ? "EN" : item === "hi" ? "हिं" : "ગુ"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-900/70">
            {messages.length === 1 && (
              <div className="mb-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => sendMessage(t.export)}
                  className="rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-orange-400 hover:bg-orange-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  🌍 {t.export}
                </button>

                <button
                  type="button"
                  onClick={() => sendMessage(t.import)}
                  className="rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-orange-400 hover:bg-orange-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  📦 {t.import}
                </button>

                <button
                  type="button"
                  onClick={() => sendMessage(t.quote)}
                  className="rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-orange-400 hover:bg-orange-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  💰 {t.quote}
                </button>

                <button
                  type="button"
                  onClick={() => sendMessage(t.products)}
                  className="rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-orange-400 hover:bg-orange-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  📋 {t.products}
                </button>
              </div>
            )}

            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex ${
                  item.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[88%] gap-2 ${
                    item.role === "USER" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      item.role === "USER"
                        ? "bg-orange-500 text-white"
                        : "bg-gradient-to-br from-amber-500 to-red-500 text-white"
                    }`}
                  >
                    {item.role === "USER" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      item.role === "USER"
                        ? "rounded-tr-md bg-orange-500 text-white"
                        : "rounded-tl-md border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {item.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400">
                  <Sparkles className="h-4 w-4 animate-pulse text-orange-500" />
                  {t.typing}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/10 dark:border-white/10 dark:bg-slate-900"
            >
              <input
                ref={inputRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t.placeholder}
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />

              <button
                type="submit"
                disabled={!message.trim() || loading}
                aria-label={t.send}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400">
              <Sparkles className="h-3 w-3" />
              {t.footer}
            </div>
          </div>
        </div>
      )}
    </>
  );
}