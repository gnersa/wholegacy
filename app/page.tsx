export default function Home() {
  return (
    <main>
      <nav className="nav container">
        <a className="brand" href="#"><span className="tree">♧</span>WHOLEGACY</a>
        <div className="navLinks">
          <a href="#about">About</a><a href="#features">Features</a><a href="#how">How It Works</a>
          <a href="#families">For Families</a><a href="#faq">FAQ</a><a href="#contact">Contact</a>
        </div>
        <a className="button small" href="#notify">Notify Me <span>→</span></a>
      </nav>

      <section className="hero">
        <img src="/hero-mockup.png" className="heroVisual" alt="WHOLEGACY digital legacy keepsake" />
        <div className="container heroContent">
          <div className="copy">
            <p className="eyebrow">YOUR STORY. YOUR IDENTITY. YOUR LEGACY.</p>
            <h1>Preserve what<br/>matters.<br/><em>Pass it on.</em></h1>
            <p className="lead">WHOLEGACY is a digital legacy platform that helps you preserve your stories, memories, important documents, and wishes for the people you love.</p>
            <form className="signup" onSubmit={(e)=>e.preventDefault()}>
              <span>✉</span><input type="email" placeholder="Enter your email" aria-label="Email address" required/>
              <button className="button" type="submit">Notify Me <span>→</span></button>
            </form>
            <p className="privacy">♢ &nbsp;We respect your privacy. No spam, ever.</p>
          </div>
        </div>
        <div className="trust container">
          <div><b>♢</b><strong>Secure & Private</strong><small>Your data is encrypted<br/>and protected.</small></div>
          <div><b>♙</b><strong>You Decide</strong><small>Choose who will see<br/>what and when.</small></div>
          <div><b>♧</b><strong>For Generations</strong><small>A legacy that lives on<br/>for your loved ones.</small></div>
          <div><b>♡</b><strong>Made with Care</strong><small>Thoughtful technology<br/>for what matters most.</small></div>
        </div>
      </section>

      <section id="about" className="section center">
        <p className="eyebrow">BUILT FOR WHAT TRULY MATTERS</p>
        <h2>More than files.<br/><em>It&apos;s your legacy.</em></h2>
        <p>WHOLEGACY brings your stories, memories, people, and wishes together in one thoughtful private space.</p>
      </section>

      <section id="features" className="section features">
        {[
          ["♢","Your Story","Capture your life story, milestones, lessons, and memories in one beautiful timeline."],
          ["▧","Your Memories","Keep photos, videos, letters, and the moments that mean the most."],
          ["♙","Your People","Choose the people you trust and decide what they can access and when."],
          ["♡","Your Legacy","Leave messages, wishes, and instructions for the people who matter."]
        ].map(([icon,title,text])=><article key={title}><i>{icon}</i><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <section id="how" className="section how">
        <div className="container howGrid">
          <div><p className="eyebrow">SIMPLE AND THOUGHTFUL</p><h2>Build something<br/><em>worth remembering.</em></h2><p>Create your private legacy space, add what matters, and stay in control of what you leave behind.</p></div>
          <div className="steps">
            <div><b>01</b><span><strong>Create your space</strong>Start your personal legacy in minutes.</span></div>
            <div><b>02</b><span><strong>Tell your story</strong>Add memories, milestones, documents, and messages.</span></div>
            <div><b>03</b><span><strong>Choose your people</strong>Decide who can access what and when.</span></div>
          </div>
        </div>
      </section>

      <section id="notify" className="notify">
        <div className="container notifyGrid"><div><p className="eyebrow">COMING SOON</p><h2>Something meaningful<br/>is coming.</h2><p>Be the first to know when WHOLEGACY launches.</p></div>
        <form className="signup" onSubmit={(e)=>e.preventDefault()}><input type="email" placeholder="Enter your email" aria-label="Email address" required/><button className="button" type="submit">Notify Me <span>→</span></button></form></div>
      </section>

      <footer id="contact" className="footer"><div className="container footerGrid">
        <a className="brand" href="#"><span className="tree">♧</span>WHOLEGACY</a><p>Who you are. What you leave behind.</p>
        <div><a href="#about">About</a><a href="#features">Features</a><a href="#contact">Contact</a><a href="#">Privacy</a><a href="#">Terms</a></div>
        <small>© 2026 WHOLEGACY. All rights reserved.</small>
      </div></footer>
    </main>
  );
}
