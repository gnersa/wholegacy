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

const legacyPages = [
  {
    icon: "∞",
    title: "Digital Legacy",
    text: "Preserve the stories, values, experiences, and information that define your life.",
    href: "/digital-legacy",
  },
  {
    icon: "♧",
    title: "Private Documents",
    text: "Keep important personal and family documents organized in one private digital space.",
    href: "/private-documents-and-memories",
  },
  {
    icon: "♡",
    title: "Memory Vault",
    text: "Preserve photos, memories, stories, and meaningful moments in your private digital archive.",
    href: "/memory-vault",
  },
  {
    icon: "⌂",
    title: "Family Archive",
    text: "Build a private family archive for stories, history, documents, photographs, and memories.",
    href: "/family-archive",
  },
  {
    icon: "▱",
    title: "Life Story",
    text: "Preserve the experiences, milestones, and stories that shaped who you are.",
    href: "/life-story",
  },
  {
    icon: "◇",
    title: "Digital Inheritance",
    text: "Prepare meaningful information, messages, wishes, and digital assets for people you trust.",
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
    a: "WHOLEGACY provides a private digital space for preserving important documents, personal memories, family stories, photos, and other meaningful information together as part of your digital legacy.",
  },
  {
    q: "What is a digital memory vault?",
    a: "A digital memory vault is a private online space for preserving meaningful memories, photos, stories, videos, personal notes, and important documents.",
  },
  {
    q: "Can WHOLEGACY be used as a private family archive?",
    a: "Yes. WHOLEGACY can be used as a private family digital archive for preserving family documents, memories, stories, photographs, important information, and personal history for future generations.",
  },
  {
    q: "What can I store in WHOLEGACY?",
    a: "You can preserve private documents, family records, photos, memories, life stories, personal messages, important information, values, wishes, and other meaningful content.",
  },
  {
    q: "Are my Private Notes secure?",
    a: "WHOLEGACY Private Notes are designed as private spaces protected by password and workspace access.",
  },
];

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WHOLEGACY",
    url: "https://wholelegacy.com",
    description:
      "WHOLEGACY is a private digital legacy platform for preserving documents, memories, stories, values, and wishes.",
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WHOLEGACY",
    url: "https://wholelegacy.com",
    description:
      "A private digital legacy platform for preserving documents, memories, stories, values, and wishes.",
  };

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

  return (
    <main>
      {/* =========================
          GEO / STRUCTURED DATA
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
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      {/* =========================
          NAV
          EXISTING APPLE-STYLE
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
          APPLE-STYLE
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
              WHOLEGACY is a private digital legacy platform for preserving
              your stories, memories, important documents, values, and wishes
              for the people you love and future generations.
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
              alt="WHOLEGACY private digital legacy platform"
              fill
              priority
              sizes="(max-width: 950px) 100vw, 55vw"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
          ORIGINAL STRUCTURE
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
          GEO HUB
          
          Menggunakan style feature
          yang sudah ada sehingga UI
          tetap konsisten.
      ========================== */}

      <section id="legacy" className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">EXPLORE YOUR LEGACY</p>

            <h2>Everything that matters, in one place.</h2>

            <p>
              Explore the different ways WHOLEGACY helps you preserve your
              documents, memories, stories, family history, and digital
              legacy.
            </p>
          </div>

          <div className="features-grid">
            {legacyPages.map((page) => (
              <article className="feature" key={page.href}>
                <div className="feature-icon">{page.icon}</div>

                <h3>{page.title}</h3>

                <p>{page.text}</p>

                <p style={{ marginTop: "18px" }}>
                  <a
                    href={page.href}
                    style={{
                      color: "var(--gold)",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Explore <span>→</span>
                  </a>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
          ORIGINAL APPLE-STYLE
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
          WHY WHOLEGACY
      ========================== */}

      <section className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">WHY WHOLEGACY</p>

            <h2>More than cloud storage.</h2>

            <p>
              WHOLEGACY is designed specifically for your digital legacy —
              not simply for storing files. It gives meaning and structure to
              the information, memories, stories, and wishes you want to
              preserve.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature">
              <div className="feature-icon">♙</div>
              <h3>Private</h3>
              <p>
                Keep your personal legacy in a space designed around privacy
                and control.
              </p>
            </article>

            <article className="feature">
              <div className="feature-icon">♡</div>
              <h3>Meaningful</h3>
              <p>
                Preserve more than files by capturing the stories and memories
                behind them.
              </p>
            </article>

            <article className="feature">
              <div className="feature-icon">◇</div>
              <h3>Personal</h3>
              <p>
                Build a digital archive around your own life, family, values,
                and wishes.
              </p>
            </article>

            <article className="feature">
              <div className="feature-icon">∞</div>
              <h3>Future-focused</h3>
              <p>
                Prepare something meaningful that can remain valuable for
                people you trust and future generations.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =========================
          FAQ
          GEO
      ========================== */}

      <section id="faq" className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p>

            <h2>Questions about WHOLEGACY</h2>

            <p>
              Learn more about digital legacy, private documents, memories,
              family archives, and preserving what matters.
            </p>
          </div>

          <div
            style={{
              maxWidth: "820px",
              margin: "0 auto",
              borderTop: "1px solid var(--line)",
            }}
          >
            {faqs.map((faq) => (
              <details
                key={faq.q}
                style={{
                  padding: "22px 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "var(--navy)",
                  }}
                >
                  {faq.q}
                </summary>

                <p
                  style={{
                    margin: "14px 0 0",
                    color: "var(--muted)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    maxWidth: "700px",
                  }}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "35px",
            }}
          >
            <a
              href="/faq"
              style={{
                color: "var(--gold)",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              View all frequently asked questions <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          PRIVATE DOCUMENTS CTA
      ========================== */}

      <section className="section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">PRIVATE DOCUMENTS &amp; MEMORIES</p>

            <h2>Preserve what matters most.</h2>

            <p>
              Looking for a private place to keep important documents,
              memories, family stories, and personal information? WHOLEGACY
              brings them together as part of your digital legacy.
            </p>

            <p style={{ marginTop: "25px" }}>
              <a
                href="/private-documents-and-memories"
                style={{
                  color: "var(--gold)",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Explore Private Documents &amp; Memories <span>→</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          NOTIFY
          ORIGINAL APPLE-STYLE
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
          APPLE-STYLE
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

            <a href="/security">Security</a>

            <a href="#contact">Contact</a>
          </div>

          <div>
            <h4>Explore</h4>

            <a href="/digital-legacy">Digital Legacy</a>

            <a href="/private-documents-and-memories">
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
