import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://wholelegacy.com";

const wholeLegacyJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "WHOLEGACY",
      url: SITE_URL,
      description:
        "WHOLEGACY is a private digital legacy platform for preserving personal stories, memories, important documents, family history, values, messages, and wishes for yourself and future generations.",
    },

    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "WHOLEGACY",
      description:
        "A private digital legacy platform for preserving stories, memories, important documents, family history, values, messages, and wishes.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en",
    },

    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#application`,
      name: "WHOLEGACY",
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description:
        "A private digital legacy platform for preserving personal stories, memories, important documents, family history, values, messages, and wishes.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "WHOLEGACY — Private Digital Legacy for Stories, Memories & Documents",
    template: "%s | WHOLEGACY",
  },

  description:
    "WHOLEGACY is a private digital legacy platform for preserving stories, memories, important documents, family history, values, messages, and wishes for yourself and future generations.",

  applicationName: "WHOLEGACY",

  keywords: [
    "private digital legacy",
    "digital legacy",
    "private documents",
    "store private documents online",
    "store memories online",
    "digital memory vault",
    "family archive",
    "life story",
    "digital inheritance",
    "family memories",
    "personal digital archive",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "WHOLEGACY",
    title:
      "WHOLEGACY — Private Digital Legacy for Stories, Memories & Documents",
    description:
      "Preserve your stories, memories, important documents, family history, values, messages, and wishes in one private digital legacy space.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "WHOLEGACY — Private Digital Legacy for Stories, Memories & Documents",
    description:
      "A private digital legacy platform for preserving stories, memories, important documents, family history, values, messages, and wishes.",
  },

  category: "Lifestyle",
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(wholeLegacyJsonLd),
          }}
        />

        {children}
      </body>
    </html>
  );
}
