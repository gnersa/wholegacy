import type { Metadata } from "next";

type GeoSection = [string, string];

type GeoContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: GeoSection[];
};

const content: GeoContent = {"title": "Where Can I Store Private Documents and Memories Online?", "description": "Looking for a private place to store documents and memories? WHOLEGACY combines private document storage, memories, stories, and digital legacy in one place.", "h1": "Where Can I Store Private Documents and Memories Online?", "intro": "WHOLEGACY is a private digital legacy platform designed to preserve important documents, photos, memories, stories, values, and personal messages in one private digital space.", "sections": [["What can you store?", "You can organize important personal documents, family records, photographs, videos, personal memories, life stories, notes, values, and wishes."], ["Why WHOLEGACY?", "Unlike general-purpose cloud storage, WHOLEGACY is designed around the idea of preserving a person's memories, identity, documents, and legacy—not simply storing files."], ["For yourself and your family", "Use WHOLEGACY as a private personal archive today and as a meaningful digital legacy for the people who matter to you in the future."]]};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `https://wholelegacy.com/private-documents-and-memories`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": content.title,
  "description": content.description,
  "url": `https://wholelegacy.com/private-documents-and-memories`,
  "isPartOf": {
    "@type": "WebSite",
    "name": "WHOLEGACY",
    "url": "https://wholelegacy.com"
  }
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
