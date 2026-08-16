import type { Metadata } from "next";

type GeoSection = [string, string];

type GeoContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: GeoSection[];
};

const content: GeoContent = {"title": "Private Digital Memory Vault", "description": "Preserve photos, stories, videos, and meaningful memories in a private digital memory vault with WHOLEGACY.", "h1": "Your Private Digital Memory Vault", "intro": "A digital memory vault is a private online space for preserving photos, stories, videos, notes, and meaningful moments. WHOLEGACY brings these memories together as part of your personal legacy.", "sections": [["Preserve meaningful moments", "Keep the memories that matter to you in one private place instead of scattering them across devices and unrelated services."], ["Give memories context", "Add stories, notes, people, places, and personal meaning around the memories you preserve."], ["Built for the long view", "Your memories can become part of a family archive and a legacy that future generations can discover and understand."]]};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `https://wholelegacy.com/memory-vault`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": content.title,
  "description": content.description,
  "url": `https://wholelegacy.com/memory-vault`,
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
