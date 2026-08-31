import type { Metadata } from "next";
import Script from "next/script"; // 1. Import komponen Script dari Next.js
import "./globals.css";

const SITE_URL = "https://wholegacy.com";

const whoLegacyJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "WHOLEGACY",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon_512.png`,
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

  verification: {
    google: "CFU6X6vG1VVtWzdmvc8xpXBnVL7an7YLI630RvCfd5Q",
  },

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

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/favicon_512.png",
    shortcut: "/favicon.ico",
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
    images: [
      {
        url: "/og/og_light.png",
        width: 1200,
        height: 630,
        alt: "WHOLEGACY — Private Digital Legacy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "WHOLEGACY — Private Digital Legacy for Stories, Memories & Documents",
    description:
      "A private digital legacy platform for preserving stories, memories, important documents, family history, values, messages, and wishes.",
    images: ["/og/og_light.png"],
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
            __html: JSON.stringify(whoLegacyJsonLd),
          }}
        />
        
        {children}

        {/* 2. PENEMPATAN BADGE DMCA */}
        <div style={{ textAlign: "center", padding: "20px 0" }}>
         <a
            href="//www.dmca.com/Protection/Status.aspx?ID=d9e040d4-b3d6-4992-a83c-070c01540141"
            title="DMCA.com Protection Status"
            target="_blank"
            rel="noopener noreferrer"
            className="dmca-badge"
          >
            <img
              src="https://images.dmca.com/Badges/dmca_protected_27_120.png?ID=d9e040d4-b3d6-4992-a83c-070c01540141"
              alt="DMCA.com Protection Status"
            />
          </a>

        {/* 3. PENEMPATAN SCRIPT DMCA */}
        <Script
          src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
