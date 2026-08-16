"use client";

import { useState } from "react";

const SITE_URL = "https://wholegacy.com";

const ENTITY_DESCRIPTION =
  "WHOLEGACY is a private digital legacy platform for preserving important documents, memories, stories, values, messages, and wishes for yourself and future generations.";

const features = [
  {
    icon: "✦",
    title: "Your Story",
    text: "Preserve your life story, experiences, milestones, lessons, and moments that shaped who you are.",
  },
  {
    icon: "♡",
    title: "Your Memories",
    text: "Store meaningful memories, photos, stories, letters, and moments you want to preserve for the future.",
  },
  {
    icon: "⌂",
    title: "Your Family",
    text: "Create a private family archive for stories, history, photographs, information, and memories.",
  },
  {
    icon: "◈",
    title: "Your Documents",
    text: "Organize important personal and family documents in one private digital space.",
  },
  {
    icon: "∞",
    title: "Your Legacy",
    text: "Prepare something meaningful for the people you love and future generations.",
  },
];

const legacyPages = [
  {
    icon: "∞",
    title: "Digital Legacy",
    description:
      "Learn how to preserve your stories, values, memories, important information, and wishes as part of your digital legacy.",
    href: "/digital-legacy",
  },
  {
    icon: "◈",
    title: "Private Documents",
    description:
      "Organize important personal and family documents in a private digital space.",
    href: "/private-document-storage",
  },
  {
    icon: "♡",
    title: "Memory Vault",
    description:
      "Preserve photos, memories, stories, letters, and meaningful moments in a private digital archive.",
    href: "/memory-vault",
  },
  {
    icon: "⌂",
    title: "Family Archive",
    description:
      "Create a private family archive for stories, photographs, documents, history, and memories.",
    href: "/family-archive",
  },
  {
    icon: "✦",
    title: "Life Story",
    description:
      "Capture the experiences, milestones, and stories that shaped your life.",
    href: "/life-story",
  },
  {
    icon: "◇",
    title: "Digital Inheritance",
    description:
      "Prepare meaningful messages, wishes, information, and digital assets for people you trust.",
    href: "/digital-inheritance",
  },
];

const faqs = [
  {
    q: "What is WHOLEGACY?",
    a: "WHOLEGACY is a private digital legacy platform for preserving important documents, memories, stories, values, messages, and wishes for yourself and future generations.",
  },
  {
    q: "Where can I store private documents and memories online?",
    a: "WHOLEGACY provides a private digital space for organizing and preserving important documents, family memories, personal stories, photos, messages, and other meaningful information.",
  },
  {
    q: "What is a digital legacy?",
    a: "A digital legacy is the collection of personal stories, memories, documents, digital assets, values, messages, and wishes that a person intentionally preserves for themselves and the people they care about.",
  },
  {
    q: "What is a digital memory vault?",
    a: "A digital memory vault is a private online space for preserving meaningful memories, photos, stories, videos, letters, personal notes, and important documents for the future.",
  },
  {
    q: "Can WHOLEGACY be used as a private family archive?",
    a: "Yes. WHOLEGACY can be used as a private family archive for preserving family stories, photographs, documents, history, memories, important information, and personal messages for future generations.",
  },
  {
    q: "What can I store in WHOLEGACY?",
    a: "You can preserve life stories, family memories, photos, personal messages, private documents, important information, values, wishes, digital assets, and other meaningful content.",
  },
  {
    q: "Are WHOLEGACY Private Notes secure?",
    a: "WHOLEGACY Private Notes are designed as private spaces protected by password and workspace access.",
  },
];

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [slug, setSlug] = useState("");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "WHOLEGACY",
    url: SITE_URL,
    description: ENTITY_DESCRIPTION,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "WHOLEGACY",
    url: SITE_URL,
    description: ENTITY_DESCRIPTION,
  };

  return (
    <main className="wl-home">
      {/* =========================================
          ENTITY / WEBSITE STRUCTURED DATA
      ========================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      {/* =========================================
          ANNOUNCEMENT
      ========================================== */}

      <div className="wl-announcement">
        <span>
          Preserve what matters. Leave something meaningful behind.
        </span>

        <a href="#start">
          Create your legacy →
        </a>
      </div>

      {/* =========================================
          NAVIGATION
      ========================================== */}

      <header className="wl-nav">
        <div className="wl-nav-inner">
          <a href="/" className="wl-brand">
            <img src="/logo-header.png" alt="WHOLEGACY" className="wl-brand-img" />
            <span>WHOLEGACY</span>
          </a>

          <nav className="wl-nav-links" aria-label="Main navigation">
            <a href="#why">Why WHOLEGACY</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#explore">Explore</a>
            <a href="#faq">FAQ</a>
          </nav>

          <a href="#start" className="wl-nav-button">
            Start Your Legacy
          </a>
        </div>
      </header>

      {/* =========================================
          HERO
      ========================================== */}

      <section className="wl-hero" aria-labelledby="main-heading">
        <div className="wl-hero-inner">
          <div className="wl-eyebrow">
            <span />
            PRIVATE DIGITAL LEGACY PLATFORM
          </div>

          <h1 id="main-heading">
            Private Digital Legacy
            <br />
            for Your Stories,
            <br />
            <em>Memories &amp; Documents.</em>
          </h1>

          <p className="wl-hero-text">
            WHOLEGACY is a private digital legacy platform for preserving
            your stories, memories, important documents, values, messages,
            and wishes for yourself and future generations.
          </p>

          <div className="wl-hero-actions">
            <a
              href="#start"
              className="wl-button wl-button-primary"
            >
              Begin Your Legacy
              <span>→</span>
            </a>

            <a
              href="#how"
              className="wl-button wl-button-secondary"
            >
              Discover WHOLEGACY
            </a>
          </div>

          <div className="wl-hero-note">
            <span>✓</span>
            Private by design
            <span>•</span>
            Built for your future
            <span>•</span>
            Your story, your control
          </div>
        </div>

        <div
          className="wl-hero-visual"
          aria-hidden="true"
        >
          <div className="wl-orbit wl-orbit-one" />
          <div className="wl-orbit wl-orbit-two" />

          <div className="wl-legacy-card">
            <div className="wl-card-top">
              <span>WHOLEGACY</span>
              <span>PRIVATE</span>
            </div>

            <div className="wl-card-content">
              <div className="wl-card-label">
                YOUR DIGITAL LEGACY
              </div>

              <h3>
                Everything that
                <br />
                makes you, you.
              </h3>

              <p>
                Stories. Memories.
                <br />
                Documents. Wishes.
              </p>
            </div>

            <div className="wl-card-bottom">
              <span>Private Digital Legacy</span>
              <span>∞</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          TRUST / ENTITY CONTEXT
      ========================================== */}

      <section
        className="wl-trust"
        aria-label="WHOLEGACY benefits"
      >
        <div>
          <strong>ONE PLACE</strong>
          <span>for everything that matters</span>
        </div>

        <div>
          <strong>PRIVATE</strong>
          <span>by design</span>
        </div>

        <div>
          <strong>MEANINGFUL</strong>
          <span>for generations</span>
        </div>
      </section>

      {/* =========================================
          WHY WHOLEGACY
      ========================================== */}

      <section
        id="why"
        className="wl-section wl-light"
        aria-labelledby="why-heading"
      >
        <div className="wl-container">
          <div className="wl-heading">
            <div className="wl-section-label">
              WHY WHOLEGACY
            </div>

            <h2 id="why-heading">
              Some things are too important
              <br />
              to be forgotten.
            </h2>

            <p>
              Photos can disappear. Documents can be misplaced.
              Stories can fade. Memories can become fragments.
              WHOLEGACY gives you a private place to intentionally
              preserve what makes your life meaningful.
            </p>
          </div>

          <div className="wl-feature-grid">
            {features.map((feature) => (
              <article
                className="wl-feature-card"
                key={feature.title}
              >
                <div className="wl-feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
      ========================================== */}

      <section
        id="how"
        className="wl-section"
        aria-labelledby="how-heading"
      >
        <div className="wl-container">
          <div className="wl-two-column">
            <div>
              <div className="wl-section-label">
                HOW IT WORKS
              </div>

              <h2 id="how-heading">
                Create something
                <br />
                that outlives you.
              </h2>

              <p className="wl-section-text">
                WHOLEGACY turns the things that matter to you
                into an organized private digital legacy.
              </p>

              <div className="wl-steps">
                <div className="wl-step">
                  <span>01</span>

                  <div>
                    <h3>Create</h3>
                    <p>
                      Create your personal WHOLEGACY space.
                    </p>
                  </div>
                </div>

                <div className="wl-step">
                  <span>02</span>

                  <div>
                    <h3>Preserve</h3>
                    <p>
                      Add stories, memories, documents,
                      values, and personal messages.
                    </p>
                  </div>
                </div>

                <div className="wl-step">
                  <span>03</span>

                  <div>
                    <h3>Protect</h3>
                    <p>
                      Organize and protect information
                      that matters to you.
                    </p>
                  </div>
                </div>

                <div className="wl-step">
                  <span>04</span>

                  <div>
                    <h3>Leave a Legacy</h3>
                    <p>
                      Prepare something meaningful for
                      the people who matter most.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="wl-dashboard">
              <div className="wl-dashboard-top">
                <span />
                <span />
                <span />

                <label>WHOLEGACY</label>
              </div>

              <div className="wl-dashboard-body">
                <aside>
                  <strong>MY LEGACY</strong>

                  <div>My Story</div>
                  <div>Memories</div>
                  <div>Documents</div>
                  <div>Values</div>
                  <div>My Wishes</div>
                </aside>

                <div className="wl-dashboard-main">
                  <small>YOUR DIGITAL LEGACY</small>

                  <h3>My Life Story</h3>

                  <div className="wl-timeline">
                    <div>
                      <b>1990</b>
                      <span>
                        The beginning of my story
                      </span>
                    </div>

                    <div>
                      <b>2010</b>
                      <span>
                        Important moments &amp; memories
                      </span>
                    </div>

                    <div>
                      <b>2026</b>
                      <span>
                        Building my legacy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          PRIVATE NOTE
      ========================================== */}

      <section className="wl-private">
        <div className="wl-container">
          <div className="wl-private-card">
            <div>
              <div className="wl-section-label">
                PRIVATE NOTE
              </div>

              <h2>
                Some thoughts
                <br />
                are meant to stay private.
              </h2>

              <p>
                WHOLEGACY Private Note gives you a simple,
                protected space to write down things that
                matter to you.
              </p>

              <a
                href="/private-documents-and-memories"
                className="wl-button wl-button-primary"
              >
                Explore Private Space →
              </a>
            </div>

            <div className="wl-private-visual">
              <div className="wl-note-window">
                <div className="wl-note-header">
                  <span>WHOLEGACY</span>

                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div className="wl-note-tabs">
                  <span>Note 1</span>
                  <span className="active">
                    My Story
                  </span>
                  <span>+</span>
                </div>

                <div className="wl-note-content">
                  <span>
                    your private thoughts go here...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          TOPICAL HUB
      ========================================== */}

      <section
        id="explore"
        className="wl-section wl-light"
        aria-labelledby="explore-heading"
      >
        <div className="wl-container">
          <div className="wl-heading center">
            <div className="wl-section-label">
              EXPLORE YOUR LEGACY
            </div>

            <h2 id="explore-heading">
              Everything that matters
              <br />
              in one private place.
            </h2>

            <p>
              Explore the different ways WHOLEGACY helps you
              preserve private documents, memories, stories,
              family history, and your digital legacy.
            </p>
          </div>

          <div className="wl-feature-grid">
            {legacyPages.map((page) => (
              <article
                className="wl-feature-card"
                key={page.href}
              >
                <div className="wl-feature-icon">
                  {page.icon}
                </div>

                <h3>{page.title}</h3>

                <p>{page.description}</p>

                <a
                  href={page.href}
                  style={{
                    display: "inline-block",
                    marginTop: "18px",
                    color: "#7d6229",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Explore {page.title} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          FEATURE EXPLORER
      ========================================== */}

      <section
        id="features"
        className="wl-section wl-light"
        aria-labelledby="features-heading"
      >
        <div className="wl-container">
          <div className="wl-heading center">
            <div className="wl-section-label">
              BUILT FOR YOUR LEGACY
            </div>

            <h2 id="features-heading">
              Everything you need
              <br />
              to preserve what matters.
            </h2>
          </div>

          <div className="wl-feature-tabs">
            {features.map((feature, index) => (
              <button
                key={feature.title}
                className={
                  activeFeature === index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveFeature(index)
                }
                type="button"
              >
                {feature.title}
              </button>
            ))}
          </div>

          <div className="wl-feature-detail">
            <div className="wl-feature-detail-icon">
              {features[activeFeature].icon}
            </div>

            <div>
              <div className="wl-section-label">
                {String(activeFeature + 1).padStart(
                  2,
                  "0"
                )}
              </div>

              <h3>
                {features[activeFeature].title}
              </h3>

              <p>
                {features[activeFeature].text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FAQ / GEO
      ========================================== */}

      <section
        id="faq"
        className="wl-section"
        aria-labelledby="faq-heading"
      >
        <div className="wl-container wl-faq-container">
          <div className="wl-heading center">
            <div className="wl-section-label">
              FREQUENTLY ASKED QUESTIONS
            </div>

            <h2 id="faq-heading">
              Questions about WHOLEGACY
            </h2>

            <p>
              Clear answers about private digital legacy,
              private documents, memories, family archives,
              and preserving what matters.
            </p>
          </div>

          <div className="wl-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <article
                  className={`wl-faq ${
                    isOpen ? "open" : ""
                  }`}
                  key={faq.q}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>

                    <b>
                      {isOpen ? "−" : "+"}
                    </b>
                  </button>

                  {isOpen && (
                    <div className="wl-faq-answer">
                      {faq.a}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "28px",
            }}
          >
            <a
              href="/faq"
              style={{
                color: "#7d6229",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              View the complete WHOLEGACY FAQ →
            </a>
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================== */}

      <section id="start" className="wl-final">
        <div className="wl-final-inner">
          <div className="wl-section-label">
            YOUR LEGACY STARTS HERE
          </div>

          <h2>
            What will you leave behind?
          </h2>

          <p>
            Start preserving your story today.
            It may become one of the most meaningful
            things you leave for someone tomorrow.
          </p>

          <div className="wl-start-form">
            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              placeholder="Choose your legacy URL"
              aria-label="Choose your legacy URL"
            />

            <button
              type="button"
              onClick={() => {
                const cleanSlug = slug
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                if (!cleanSlug) return;

                window.location.href =
                  `/p/${cleanSlug}`;
              }}
            >
              Create My Legacy →
            </button>
          </div>

          <small>
            wholegacy.com/p/
            {slug || "your-name"}
          </small>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================== */}

      <footer className="wl-footer">
        <div className="wl-container wl-footer-inner">
          <div>
            <a
              href="/"
              className="wl-brand footer-brand"
            >
              <span className="wl-brand-mark">
                W
              </span>

              <span>WHOLEGACY</span>
            </a>

            <p>
              Private Digital Legacy for Your Stories,
              Memories &amp; Documents.
            </p>
          </div>

          <div className="wl-footer-links">
            <a href="/about">About WHOLEGACY</a>

            <a href="/digital-legacy">
              Digital Legacy
            </a>

            <a href="/private-document-storage">
              Private Documents
            </a>

            <a href="/private-documents-and-memories">
              Private Documents &amp; Memories
            </a>

            <a href="/memory-vault">
              Memory Vault
            </a>

            <a href="/family-archive">
              Family Archive
            </a>

            <a href="/life-story">
              Life Story
            </a>

            <a href="/digital-inheritance">
              Digital Inheritance
            </a>

            <a href="/security">
              Security
            </a>

            <a href="/faq">
              FAQ
            </a>
          </div>

          <div>
            <span>
              © {new Date().getFullYear()} WHOLEGACY
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
