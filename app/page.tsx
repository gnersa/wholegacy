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

export default function Home() {
  return (
    <main>
      <nav className="nav container">
        <a className="brand" href="#">
          <span className="brand-mark">♧</span>
          WHOLEGACY
        </a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="button button-small" href="#notify">Notify Me <span>→</span></a>
      </nav>

      <section id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">YOUR STORY. YOUR IDENTITY. YOUR LEGACY.</p>
            <h1>Preserve what matters.<br /><em>Pass it on.</em></h1>
            <p className="hero-text">
              WHOLEGACY is a digital legacy platform that helps you preserve your stories,
              memories, important documents, and wishes for the people you love.
            </p>
            <form className="signup">
              <input aria-label="Email address" type="email" placeholder="Enter your email" required />
              <button className="button" type="submit">Notify Me <span>→</span></button>
            </form>
            <p className="privacy"><span>♙</span> We respect your privacy. No spam, ever.</p>
          </div>

          <div className="hero-art">
            <Image
              src="/hero-mockup.png"
              alt="WHOLEGACY memories and legacy concept"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <section id="features" className="section features-section">
        <div className="container">
          <div className="center-heading">
            <p className="eyebrow">BUILT FOR WHAT TRULY MATTERS</p>
            <h2>More than files. It&apos;s your legacy.</h2>
            <p>WHOLEGACY helps you collect, organize, and protect the moments, stories, and information that make you, you.</p>
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
            <div className="window-bar"><span></span><span></span><span></span></div>
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
                  <div><b>1990</b><span>Born in Jakarta</span></div>
                  <div><b>2008</b><span>High School</span></div>
                  <div><b>2012</b><span>Graduated from University</span></div>
                </div>
                <div className="memory-row">
                  <div></div><div></div><div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="notify" className="notify-section">
        <div className="container notify-inner">
          <div>
            <p className="eyebrow">COMING SOON</p>
            <h2>Something meaningful is coming.</h2>
            <p>Be the first to know when WHOLEGACY launches.</p>
          </div>
          <form className="signup signup-dark">
            <input aria-label="Email address" type="email" placeholder="Enter your email" required />
            <button className="button" type="submit">Notify Me <span>→</span></button>
          </form>
        </div>
      </section>

      <footer id="contact" className="footer">
        <div className="container footer-grid">
          <div>
            <a className="brand" href="#"><span className="brand-mark">♧</span> WHOLEGACY</a>
          </div>
          <div><h4>Company</h4><a href="#about">About</a><a href="#contact">Contact</a><a href="#">Careers</a></div>
          <div><h4>Resources</h4><a href="#faq">FAQ</a><a href="#">Blog</a><a href="#">Privacy</a></div>
          <div><h4>Legal</h4><a href="#">Terms of Service</a><a href="#">Privacy Policy</a></div>
          <div><h4>Follow us</h4><div className="socials"><span>◎</span><span>f</span><span>𝕏</span><span>in</span></div><p className="copyright">© 2026 WHOLEGACY. All rights reserved.</p></div>
        </div>
      </footer>
    </main>
  );
}
