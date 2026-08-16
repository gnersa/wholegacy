import type { Metadata } from "next";

const content = {"title": "Private Document Storage for Your Digital Legacy", "description": "A private place to preserve important personal and family documents as part of your digital legacy.", "h1": "Private Document Storage for Your Digital Legacy", "intro": "WHOLEGACY provides a private digital space for preserving important personal and family documents alongside the memories and stories that give them context.", "sections": [["What can you preserve?", "Important records, certificates, property documents, family records, personal files, and other documents that you want to keep organized as part of your digital legacy."], ["Why combine documents and memories?", "A document often has a story behind it. Keeping the document together with memories and notes can make your personal archive more meaningful and easier to understand later."], ["A personal archive, not just a folder", "WHOLEGACY is designed to help you build a lasting personal archive rather than simply accumulating files in generic cloud storage."]]};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `https://wholelegacy.com/private-document-storage`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": content.title,
  "description": content.description,
  "url": `https://wholelegacy.com/private-document-storage`,
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
