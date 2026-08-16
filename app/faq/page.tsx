import type { Metadata } from "next";

type GeoSection = [string, string];

type GeoContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: GeoSection[];
};

const content: GeoContent = {"title": "WHOLEGACY FAQ", "description": "Frequently asked questions about WHOLEGACY, private document storage, digital memory vaults, family archives, and digital legacy.", "h1": "Frequently Asked Questions About WHOLEGACY", "intro": "Learn how WHOLEGACY can help you preserve important documents, memories, stories, values, and wishes as part of a private digital legacy.", "sections": [["What is WHOLEGACY?", "WHOLEGACY is a private digital legacy platform for preserving important documents, memories, stories, values, and wishes for yourself and future generations."], ["Where can I store private documents and memories?", "WHOLEGACY is designed as a private digital space where you can preserve important documents, memories, stories, photos, and personal messages together."], ["What is a digital memory vault?", "A digital memory vault is a private online space for preserving meaningful photos, videos, stories, documents, notes, and memories."], ["What is a digital legacy?", "A digital legacy is the collection of digital memories, documents, stories, messages, and personal information a person chooses to preserve for themselves or future generations."], ["Who is WHOLEGACY for?", "WHOLEGACY is for individuals and families who want to preserve important information, memories, stories, and personal legacy in one private place."]]};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `https://wholelegacy.com/faq`,
  },
};


const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": content.sections.map(([question, answer]: GeoSection) => ({
    "@type": "Question",
    "name": question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": answer
    }
  }))
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": content.title,
  "description": content.description,
  "url": `https://wholelegacy.com/faq`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
