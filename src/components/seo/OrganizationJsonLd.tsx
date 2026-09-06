const SITE_URL = "https://www.krupalitraderspvtltd.com";

type OrganizationJsonLdProps = {
  locale: string;
};

export default function OrganizationJsonLd({
  locale,
}: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Krupali Traders Private Limited",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: "krupalitraderss@gmail.com",
    telephone: "+91 96010 90109",
    address: {
      "@type": "PostalAddress",
      streetAddress: "207, 2nd Floor, White House Complex, Sector 11",
      addressLocality: "Gandhinagar",
      addressRegion: "Gujarat",
      postalCode: "382010",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91 96010 90109",
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Gujarati", "Hindi", "Arabic"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          ...data,
          inLanguage: locale,
        }),
      }}
    />
  );
}
