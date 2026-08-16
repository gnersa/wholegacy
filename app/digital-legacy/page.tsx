import type { Metadata } from "next";

const content = {"title": "What Is a Digital Legacy?", "description": "Learn what a digital legacy is and how WHOLEGACY helps preserve documents, memories, stories, values, and wishes for future generations.", "h1": "What Is a Digital Legacy?", "intro": "A digital legacy is the collection of digital memories, documents, stories, messages, values, and other personal information a person chooses to preserve for themselves and future generations.", "sections": [["Preserve what matters", "WHOLEGACY gives you a private place to organize the parts of your digital life that matter beyond everyday file storage: important documents, memories, personal stories, values, and wishes."], ["More than ordinary cloud storage", "Traditional cloud storage is built around files and folders. WHOLEGACY is designed around the meaning behind those files and the legacy you want to preserve."], ["For yourself and future generations", "Your digital legacy can help you remember your own journey and give the people who matter to you a meaningful record of your life."]]};

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: `https://wholelegacy.com/digital-legacy`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": content.title,
  "description": content.description,
  "url": `https://wholelegacy.com/digital-legacy`,
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
