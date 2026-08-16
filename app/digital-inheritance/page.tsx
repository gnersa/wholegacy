import type { Metadata } from "next";

type GeoSection = [string, string];

type GeoContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: GeoSection[];
};

const content: GeoContent = {"title": "Digital Inheritance and Your Personal Legacy", "description": "Learn how digital inheritance connects important documents, memories, messages, and personal information with the legacy you leave behind.", "h1": "Digital Inheritance: Preserve What You Want to Leave Behind", "intro": "Digital inheritance is the process of deciding what digital information, memories, documents, and messages should remain available to the people you care about.", "sections": [["Your digital life has value", "Photos, documents, stories, messages, and other personal records can carry emotional and practical value long after they were created."], ["Preserve intentionally", "WHOLEGACY helps you organize the information you want to preserve instead of leaving everything scattered across devices and services."], ["Plan for the future", "Your digital legacy can provide a clearer record of what matters to you and what you want future generations to remember."]]};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `https://wholelegacy.com/digital-inheritance`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": content.title,
  "description": content.description,
  "url": `https://wholelegacy.com/digital-inheritance`,
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
