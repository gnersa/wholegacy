import Image from "next/image";

const features = [
  {
    icon: "▱",
    title: "Your Story",
    text: "Capture your life story, milestones, lessons, and memories in one beautiful timeline.",
  },
  {
    icon: "▧",
    title: "Your Memories",
    text: "Store photos, videos, letters, and voices — the moments that mean the most.",
  },
  {
    icon: "♧",
    title: "Your Assets",
    text: "Safeguard important documents and digital assets in a secure, private vault.",
  },
  {
    icon: "♙",
    title: "Your People",
    text: "Choose the people you trust and decide what they can access and when.",
  },
  {
    icon: "♡",
    title: "Your Legacy",
    text: "Leave messages, instructions, and wishes that will guide and comfort your loved ones.",
  },
];

const steps = [
  ["01", "Create your account", "Secure your space in just a few minutes."],
  ["02", "Build your legacy", "Add your stories, memories, documents, and more."],
  ["03", "Decide who & when", "You stay in control. You choose who gets what and when."],
  ["04", "Peace of mind", "Your legacy is protected — for you and your loved ones."],
];

const legacyPaths = [
  {
    icon: "∞",
    title: "Digital Legacy",
    text: "Preserve the stories, values, experiences, and information that define your life.",
    href: "/digital-legacy",
    cta: "Explore Digital Legacy",
  },
  {
    icon: "♧",
    title: "Private Documents",
    text: "Keep important personal and family documents organized in one private digital space.",
    href: "/private-document-storage",
    cta: "Explore Private Documents",
  },
  {
    icon: "♡",
    title: "Memory Vault",
    text: "Preserve photos, memories, stories, and meaningful moments in your private digital memory vault.",
    href: "/memory-vault",
    cta: "Explore Memory Vault",
  },
  {
    icon: "⌂",
    title: "Family Archive",
    text: "Build a private family archive for preserving family stories, history, documents, and memories.",
    href: "/family-archive",
    cta: "Explore Family Archive",
  },
  {
    icon: "▱",
    title: "Life Story",
    text: "Preserve the experiences, milestones, and stories that shaped who you are.",
    href: "/life-story",
    cta: "Preserve Your Life Story",
  },
  {
    icon: "◇",
    title: "Digital Inheritance",
    text: "Prepare meaningful information, messages, and digital assets that can be passed on to people you trust.",
    href: "/digital-inheritance",
    cta: "Explore Digital Inheritance",
  },
];

const faqs = [
  {
    q: "What is WHOLEGACY?",
    a: "WHOLEGACY is a private digital legacy platform for preserving important documents, memories, stories, values, messages, and wishes for yourself and future generations.",
  },
  {
    q: "Why do I need a digital legacy?",
    a: "Important parts of our lives are often scattered across devices, cloud storage, and different services. WHOLEGACY helps you intentionally organize and preserve the documents, memories, stories, and values that matter to you.",
  },
  {
    q: "What can I store in WHOLEGACY?",
    a: "You can preserve private documents, family records, photos, memories, life stories, personal messages, important information, values, wishes, and other meaningful content as part of your digital legacy.",
  },
  {
    q: "Where can I store private documents and memories online?",
    a: "WHOLEGACY provides a private digital space specifically designed for preserving important documents, personal memories, family stories, photos, and other meaningful information together as part of your digital legacy.",
  },
  {
    q: "What is a digital memory vault?",
    a: "A digital memory vault is a private online space for preserving meaningful memories, photos, stories, videos, personal notes, and important documents. WHOLEGACY brings these memories and personal records together as part of your digital legacy.",
  },
  {
    q: "Can WHOLEGACY be used as a private family archive?",
    a: "Yes. WHOLEGACY can be used as a private family digital archive for preserving family documents, memories, stories, photographs, important information, and personal history for future generations.",
  },
  {
    q: "Are my Private Notes secure?",
    a: "WHOLEGACY Private Notes are designed as private spaces protected by password and workspace access.",
  },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WHOLEGACY",
    url: "https://wholelegacy.com",
    description:
      "WHOLEGACY is a private digital legacy platform for preserving documents, memories, stories, values, and wishes.",
  };

  return (
    <main>
      {/* =========================
          STRUCTURED DATA
      ========================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      {/* =========================
          NAVIGATION
          EXISTING UI PRESERVED
      ========================== */}
      <nav className="nav container">
        <a className="brand" href="/">
          <span className="brand-mark">♧</span>
          WHOLEGACY
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="/about">About</a>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#legacy">Explore</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </div>

        <a className="button button-small" href="#notify">
          Notify Me <span>→</span>
        </a>
      </nav>

      {/* =========================
          HERO
          EXISTING UI PRESERVED
      ========================== */}
      <section id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              YOUR STORY. YOUR IDENTITY. YOUR LEGACY.
            </p>

            <h1>
              Preserve what matters.
              <br />
              <em>Pass it on.</em>
            </h1>

            <p className="hero-text">
              WHOLEGACY is a private digital legacy platform that helps you
              preserve your stories, memories, important documents, values,
              and wishes for the people you love and future generations.
            </p>

            <form className="signup">
              <input
                aria-label="Email address"
                type="email"
                placeholder="Enter your email"
                required
              />

              <button className="button" type="submit">
                Notify Me <span>→</span>
              </button>
            </form>

            <p className="privacy">
              <span>♙</span> We respect your privacy. No spam, ever.
            </p>
          </div>

          <div className="hero-art">
            <Image
              src="/hero-mockup.png"
              alt="WHOLEGACY private digital legacy platform for preserving memories and documents"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
          EXISTING UI PRESERVED
      ========================== */}
      <section id="features" className="section features-section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">BUILT FOR WHAT TRULY MATTERS</p>

            <h2>More than files. It&apos;s your legacy.</h2>

            <p>
              WHOLEGACY helps you collect, organize, and protect the moments,
              stories, and information that make you, you.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <article className="feature" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          EXPLORE YOUR LEGACY
          NEW CONTENT / EXISTING UI
      ========================== */}
      <section id="legacy" className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">EXPLORE YOUR LEGACY</p>

            <h2>Everything That Matters, In One Place.</h2>

            <p>
              Explore the different ways WHOLEGACY helps you preserve your
              documents, memories, stories, and family history for generations
              to come.
            </p>
          </div>

          <div className="features-grid">
            {legacyPaths.map((item) => (
              <article className="feature" key={item.href}>
                <div className="feature-icon">{item.icon}</div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <a href={item.href}>
                  {item.cta} <span>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
          EXISTING UI PRESERVED
      ========================== */}
      <section id="how" className="section how-section">
        <div className="container how-grid">
          <div>
            <p className="eyebrow">SIMPLE AND THOUGHTFUL</p>

            <h2>How WHOLEGACY works</h2>

            <div className="steps">
              {steps.map(([number, title, text]) => (
                <div className="step" key={number}>
                  <div className="step-number">{number}</div>

                  <div>
                    <h3>{title}</h3>

                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="window-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="dashboard-layout">
              <aside>
                <strong>♧ WHOLEGACY</strong>

                <small>Dashboard</small>
                <small>My Story</small>
                <small>Memories</small>
                <small>Documents</small>
                <small>People</small>
                <small>Legacy Plan</small>
                <small>Messages</small>
              </aside>

              <div className="dashboard-main">
                <p className="mini-label">WELCOME, ALEX</p>

                <h3>My Story</h3>

                <div className="fake-timeline">
                  <div>
                    <b>1990</b>
                    <span>Born in Jakarta</span>
                  </div>

                  <div>
                    <b>2008</b>
                    <span>High School</span>
                  </div>

                  <div>
                    <b>2012</b>
                    <span>Graduated from University</span>
                  </div>
                </div>

                <div className="memory-row">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FAQ
          NEW GEO CONTENT
      ========================== */}
      <section id="faq" className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p>

            <h2>Questions About WHOLEGACY</h2>

            <p>
              Learn more about digital legacy, private documents, memories,
              family archives, and how WHOLEGACY helps preserve what matters.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.q}>
                <summary>{faq.q}</summary>

                <p>{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="center-heading">
            <p>
              <a href="/faq">
                View all frequently asked questions <span>→</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          PRIVATE DOCUMENTS CTA
          DIRECT SEARCH / GEO INTENT
      ========================== */}
      <section className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">PRIVATE DOCUMENTS &amp; MEMORIES</p>

            <h2>Preserve What Matters Most.</h2>

            <p>
              Looking for a private place to keep your important documents,
              memories, family stories, and personal information? WHOLEGACY
              brings them together as part of your digital legacy.
            </p>

            <p>
              <a href="/private-documents-and-memories">
                Explore Private Documents &amp; Memories <span>→</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          NOTIFY
          EXISTING UI PRESERVED
      ========================== */}
      <section id="notify" className="notify-section">
        <div className="container notify-inner">
          <div>
            <p className="eyebrow">COMING SOON</p>

            <h2>Something meaningful is coming.</h2>

            <p>Be the first to know when WHOLEGACY launches.</p>
          </div>

          <form className="signup signup-dark">
            <input
              aria-label="Email address"
              type="email"
              placeholder="Enter your email"
              required
            />

            <button className="button" type="submit">
              Notify Me <span>→</span>
            </button>
          </form>
        </div>
      </section>

      {/* =========================
          FOOTER
          EXISTING UI + INTERNAL LINKS
      ========================== */}
      <footer id="contact" className="footer">
        <div className="container footer-grid">
          <div>
            <a className="brand" href="/">
              <span className="brand-mark">♧</span>
              WHOLEGACY
            </a>
          </div>

          <div>
            <h4>Company</h4>

            <a href="/about">About</a>

            <a href="#contact">Contact</a>

            <a href="/security">Security &amp; Privacy</a>
          </div>

          <div>
            <h4>Explore</h4>

            <a href="/digital-legacy">Digital Legacy</a>

            <a href="/private-document-storage">
              Private Documents
            </a>

            <a href="/memory-vault">Memory Vault</a>

            <a href="/family-archive">Family Archive</a>

            <a href="/life-story">Life Story</a>

            <a href="/digital-inheritance">
              Digital Inheritance
            </a>
          </div>

          <div>
            <h4>Resources</h4>

            <a href="/private-documents-and-memories">
              Private Documents &amp; Memories
            </a>

            <a href="/faq">FAQ</a>

            <a href="/privacy">Privacy</a>

            <a href="/terms">Terms of Service</a>
          </div>

          <div>
            <h4>Follow us</h4>

            <div className="socials">
              <span>◎</span>
              <span>f</span>
              <span>𝕏</span>
              <span>in</span>
            </div>

            <p className="copyright">
              © 2026 WHOLEGACY. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
