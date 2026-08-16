import type { Metadata } from "next";
import "./globals.css";



const wholeLegacyJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://wholelegacy.com/#organization",
      "name": "WHOLEGACY",
      "url": "https://wholelegacy.com",
      "description":
        "A private digital legacy platform for preserving important documents, memories, stories, values, and wishes for yourself and future generations."
    },
    {
      "@type": "WebSite",
      "@id": "https://wholelegacy.com/#website",
      "url": "https://wholelegacy.com",
      "name": "WHOLEGACY",
      "description":
        "A private digital legacy platform for preserving documents, memories, stories, values, and wishes.",
      "publisher": {
        "@id": "https://wholelegacy.com/#organization"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://wholelegacy.com/#application",
      "name": "WHOLEGACY",
      "url": "https://wholelegacy.com",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "description":
        "A private digital legacy platform for preserving important documents, memories, stories, values, and wishes."
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(wholeLegacyJsonLd) }}
        />
{children}</body>
    </html>
  );
}
