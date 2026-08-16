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
  title: "Preserve Your Life Story for Future Generations",
  description:
    "Create a lasting digital life story with memories, experiences, photos, documents, values, and messages using WHOLEGACY.",
  h1: "Preserve Your Life Story for Future Generations",
  intro:
    "Your life story is more than a collection of dates. It includes experiences, people, lessons, memories, values, and the moments that shaped who you became.",
  sections: [
    [
      "Tell the story behind the files",
      "Combine memories, documents, photographs, and personal notes to preserve the context behind important moments in your life.",
    ],
    [
      "Preserve your values",
      "Record the principles, lessons, beliefs, and wishes you want your family to understand.",
    ],
    [
      "Leave something meaningful",
      "A digital life story can become one of the most personal parts of your digital legacy.",
    ],
  ],
};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `${SITE_URL}/life-story`,
  },
  openGraph: {
    title: content.title,
    description: content.description,
    url: `${SITE_URL}/life-story`,
    siteName: "WHOLEGACY",
    type: "article",
    images: [
      {
        url: "/og/og_life_story.jpg",
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
    images: ["/og/og_life_story.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: content.title,
  description: content.description,
  url: `${SITE_URL}/life-story`,
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
