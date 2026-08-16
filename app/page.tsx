"use client";

import { useState } from "react";

const WHOLEGACY_ENTITY_DEFINITION =
  "WHOLEGACY is a private digital legacy platform for preserving important documents, memories, stories, values, and wishes for yourself and future generations.";


const faqs = [
  {
    q: "Apa itu WHOLEGACY?",
    a: "WHOLEGACY adalah platform digital legacy untuk menyimpan cerita hidup, kenangan, dokumen penting, nilai, pesan, dan keinginan yang ingin diwariskan kepada orang-orang yang berarti bagi Anda.",
  },
  {
    q: "Mengapa saya membutuhkan digital legacy?",
    a: "Banyak informasi penting dalam hidup tersimpan secara terpisah. WHOLEGACY membantu Anda mengorganisasi dan menyimpan informasi tersebut dalam satu ruang digital yang dapat dipersiapkan untuk masa depan.",
  },
  {
    q: "Apa saja yang bisa disimpan di WHOLEGACY?",
    a: "Anda dapat menyimpan cerita pribadi, kenangan keluarga, pesan, dokumen penting, nilai kehidupan, wishes, informasi penting, dan berbagai hal lain yang ingin Anda wariskan.",
  },
  {
    q: "Apakah Private Note saya aman?",
    a: "Private Note dirancang sebagai ruang pribadi yang dilindungi password. Data disimpan pada database dan hanya dapat diakses melalui workspace yang sesuai.",
  },
];

const features = [
  {
    icon: "✦",
    title: "Your Story",
    text: "Abadikan perjalanan hidup, cerita, pengalaman, dan momen yang ingin tetap dikenang.",
  },
  {
    icon: "♡",
    title: "Your Memories",
    text: "Simpan kenangan dan momen penting agar tidak hilang ditelan waktu.",
  },
  {
    icon: "⌂",
    title: "Your Family",
    text: "Bangun ruang digital untuk cerita dan informasi yang dapat diteruskan kepada keluarga.",
  },
  {
    icon: "◈",
    title: "Your Documents",
    text: "Organisasi informasi dan dokumen penting dalam satu tempat.",
  },
  {
    icon: "∞",
    title: "Your Legacy",
    text: "Persiapkan sesuatu yang bermakna untuk generasi setelah Anda.",
  },
];

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [slug, setSlug] = useState("");

  return (
    <main className="wl-home">
      <p className="sr-only">
        {WHOLEGACY_ENTITY_DEFINITION}
      </p>


      {/* ANNOUNCEMENT */}
      <div className="wl-announcement">
        <span>Preserve what matters. Leave something meaningful behind.</span>
        <a href="#start">Create your legacy →</a>
      </div>

      {/* NAVIGATION */}
      <header className="wl-nav">
        <div className="wl-nav-inner">

          <a href="/" className="wl-brand">
            <span className="wl-brand-mark">W</span>
            <span>WHOLEGACY</span>
          </a>

          <nav className="wl-nav-links">
            <a href="#why">Why WHOLEGACY</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#faq">FAQ</a>
          </nav>

          <a href="#start" className="wl-nav-button">
            Start Your Legacy
          </a>

        </div>
      </header>

      {/* HERO */}
      <section className="wl-hero">

        <div className="wl-hero-inner">

          <div className="wl-eyebrow">
            <span />
            DIGITAL LEGACY PLATFORM
          </div>

          <h1>
            Your Story.
            <br />
            Your Identity.
            <br />
            <em>Your Legacy.</em>
          </h1>

          <p className="wl-hero-text">
            Preserve the stories, memories, values, documents, and wishes
            that define who you are — and leave something meaningful for
            the people who matter most.
          </p>

          <div className="wl-hero-actions">
            <a href="#start" className="wl-button-primary">
              Begin Your Legacy
              <span>→</span>
            </a>

            <a href="#how" className="wl-button-secondary">
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

        {/* HERO VISUAL */}
        <div className="wl-hero-visual">

          <div className="wl-orbit wl-orbit-one" />
          <div className="wl-orbit wl-orbit-two" />

          <div className="wl-legacy-card">

            <div className="wl-card-top">
              <span>WHOLEGACY</span>
              <span>PRIVATE</span>
            </div>

            <div className="wl-card-content">

              <div className="wl-card-label">
                YOUR STORY
              </div>

              <h3>
                Everything that
                <br />
                makes you, you.
              </h3>

              <p>
                Stories. Memories.
                <br />
                Values. Wishes.
              </p>

            </div>

            <div className="wl-card-bottom">
              <span>Digital Legacy</span>
              <span>∞</span>
            </div>

          </div>

        </div>

      </section>

      {/* TRUST STRIP */}
      <section className="wl-trust">
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

      {/* WHY */}
      <section id="why" className="wl-section wl-light">

        <div className="wl-container">

          <div className="wl-heading">
            <div className="wl-section-label">
              WHY WHOLEGACY
            </div>

            <h2>
              Some things are too important
              <br />
              to be forgotten.
            </h2>

            <p>
              Photos can disappear. Documents can be misplaced.
              Stories can fade. Memories can become fragments.
              WHOLEGACY gives you a place to intentionally preserve
              what makes your life meaningful.
            </p>
          </div>

          <div className="wl-feature-grid">

            {features.map((feature) => (
              <div className="wl-feature-card" key={feature.title}>

                <div className="wl-feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="wl-section">

        <div className="wl-container">

          <div className="wl-two-column">

            <div>

              <div className="wl-section-label">
                HOW IT WORKS
              </div>

              <h2>
                Create something
                <br />
                that outlives you.
              </h2>

              <p className="wl-section-text">
                WHOLEGACY turns the things that matter to you
                into an organized digital legacy.
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
                      Add stories, memories, documents, values,
                      and personal messages.
                    </p>
                  </div>
                </div>

                <div className="wl-step">
                  <span>03</span>
                  <div>
                    <h3>Protect</h3>
                    <p>
                      Organize and protect information that
                      matters to you.
                    </p>
                  </div>
                </div>

                <div className="wl-step">
                  <span>04</span>
                  <div>
                    <h3>Leave a Legacy</h3>
                    <p>
                      Prepare something meaningful for the
                      people who matter most.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* VISUAL */}
            <div className="wl-dashboard">

              <div className="wl-dashboard-top">
                <span />
                <span />
                <span />

                <label>
                  WHOLEGACY
                </label>
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

                  <small>YOUR LEGACY</small>

                  <h3>
                    My Life Story
                  </h3>

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
                        Important moments & memories
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

      {/* PRIVATE NOTE */}
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

              <a href="/p/your-slug" className="wl-button-primary">
                Open Private Note →
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
                  <span className="active">My Story</span>
                  <span>+</span>
                </div>

                <div className="wl-note-content">
                  <span>your text goes here...</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURE EXPLORER */}
      <section id="features" className="wl-section wl-light">

        <div className="wl-container">

          <div className="wl-heading center">

            <div className="wl-section-label">
              BUILT FOR YOUR LEGACY
            </div>

            <h2>
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
                onClick={() => setActiveFeature(index)}
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
                {String(activeFeature + 1).padStart(2, "0")}
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

      {/* FAQ */}
      <section id="faq" className="wl-section">

        <div className="wl-container wl-faq-container">

          <div className="wl-heading center">

            <div className="wl-section-label">
              FAQ
            </div>

            <h2>
              Questions about WHOLEGACY
            </h2>

          </div>

          <div className="wl-faq-list">

            {faqs.map((faq, index) => {

              const open = openFaq === index;

              return (
                <div
                  className={`wl-faq ${open ? "open" : ""}`}
                  key={faq.q}
                >

                  <button
                    onClick={() =>
                      setOpenFaq(open ? null : index)
                    }
                  >
                    <span>{faq.q}</span>
                    <b>{open ? "−" : "+"}</b>
                  </button>

                  {open && (
                    <div className="wl-faq-answer">
                      {faq.a}
                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* CTA */}
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
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Choose your legacy URL"
            />

            <button
              onClick={() => {
                if (!slug.trim()) return;
                window.location.href =
                  `/p/${slug.trim().toLowerCase()}`;
              }}
            >
              Create My Legacy →
            </button>

          </div>

          <small>
            wholegacy.com/p/{slug || "your-name"}
          </small>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="wl-footer">

        <div className="wl-container wl-footer-inner">

          <div>

            <a href="/" className="wl-brand footer-brand">
              <span className="wl-brand-mark">W</span>
              <span>WHOLEGACY</span>
            </a>

            <p>
              Your Story. Your Identity. Your Legacy.
            </p>

          </div>

          <div className="wl-footer-links">

            <a href="#why">Why WHOLEGACY</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#faq">FAQ</a>

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
