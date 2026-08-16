import type { Metadata } from "next";

const content = {"title": "WHOLEGACY Security and Privacy", "description": "Learn about the privacy-first approach to WHOLEGACY and how private areas are separated from public informational pages.", "h1": "WHOLEGACY Security and Privacy", "intro": "WHOLEGACY is designed around the idea that personal documents and memories should remain private. Public pages explain the product, while private user content should only be accessible through appropriate authentication and authorization.", "sections": [["Public information vs private content", "WHOLEGACY's public pages are designed to be discoverable by search engines and AI systems. Private notes and personal content should not be treated as public website content."], ["Private routes", "Private content routes are marked for search exclusion, but noindex is not a security boundary. Server-side authentication and authorization must always protect private data."], ["Privacy-first product design", "The product should clearly separate marketing content that can be indexed from personal information that belongs only to authorized users."]]};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `https://wholelegacy.com/security`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": content.title,
  "description": content.description,
  "url": `https://wholelegacy.com/security`,
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
