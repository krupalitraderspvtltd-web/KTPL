import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title:
    "Krupali Traders Private Limited | Global Import & Export Company",

  description:
    "Krupali Traders Private Limited is an India-based import and export company supplying Indian spices, fresh fruits, vegetables, herbs, dry fruits, nuts, seafood and other trade products to global buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}