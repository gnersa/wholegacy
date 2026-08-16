import type { Metadata } from "next";

type GeoSection = [string, string];

type GeoContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: GeoSection[];
};

const SITE_URL = "https://wholegacy.com";

const content: GeoContent = {
  title: "What Is a Digital Legacy?",
  description:
    "Learn what a digital legacy is and how WHOLEGACY helps preserve documents, memories, stories, values, and wishes for future generations.",
  h1: "What Is a Digital Legacy?",
  intro:
    "A digital legacy is the collection of digital memories, documents, stories, messages, values, and other personal information a person chooses to preserve for themselves and future generations.",
  sections: [
    [
      "Preserve what matters",
      "WHOLEGACY gives you a private place to organize the parts of your digital life that matter beyond everyday file storage: important documents, memories, personal stories, values, and wishes.",
    ],
    [
      "More than ordinary cloud storage",
      "Traditional cloud storage is built around files and folders. WHOLEGACY is designed around the meaning behind those files and the legacy you want to preserve.",
    ],
    [
      "For yourself and future generations",
      "Your digital legacy can help you remember your own journey and give the people who matter to you a meaningful record of your life.",
    ],
  ],
};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `${SITE_URL}/digital-legacy`,
  },
  openGraph: {
    title: content.title,
    description: content.description,
    url: `${SITE_URL}/digital-legacy`,
    siteName: "WHOLEGACY",
    type: "article",
    images: [
      {
        url: "/og/og_digital_legacy.jpg",
        width: 1200,
        height: 630,
        alt: content.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.title,
    description: content.description,
    images: ["/og/og_digital_legacy.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: content.title,
  description: content.description,
  url: `${SITE_URL}/digital-legacy`,
  isPartOf: {
    "@type": "WebSite",
    name: "WHOLEGACY",
    url: SITE_URL,
  },
};

export default function Page() {
  return (
    <main className="wl-seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wl-seo-inner">
        <p className="wl-seo-eyebrow">WHOLEGACY · PRIVATE DIGITAL LEGACY</p>
        <h1>{content.h1}</h1>
        <p className="wl-seo-intro">{content.intro}</p>
        {content.sections.map((section: [string, string]) => (
          <section key={section[0]} className="wl-seo-section">
            <h2>{section[0]}</h2>
            <p>{section[1]}</p>
          </section>
        ))}
        <div className="wl-seo-cta">
          <a href="/">Explore WHOLEGACY</a>
        </div>
      </div>
    </main>
  );
}
