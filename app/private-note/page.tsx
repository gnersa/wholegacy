import Link from "next/link";

export default function PrivateNotePage() {
  return (
    <main className="private-note-page">
      <header className="private-note-header">
        <Link href="/" className="brand">
          <span className="brand-mark">♣</span>
          <span>WHOLEGACY</span>
        </Link>

        <Link href="/" className="back-link">
          ← Back to WHOLEGACY
        </Link>
      </header>

      <section className="private-note-hero">
        <div className="eyebrow">WHOLEGACY · PRIVATE NOTE</div>

        <h1>
          Write what
          <br />
          <span>matters.</span>
        </h1>

        <p className="hero-description">
          A quiet, private space for the words, thoughts, memories, and
          messages you want to keep close — protected by your own password.
        </p>

        <div className="note-card">
          <div className="lock-icon">🔒</div>
          <h2>Your private space.</h2>

          <p>Create a memorable private address such as:</p>

          <div className="url-preview">
            <span>wholegacy.com/p/</span>
            <strong>your-name</strong>
          </div>

          <Link href="/private-note/create" className="primary-button">
            Create your Private Note <span>→</span>
          </Link>

          <p className="privacy-note">
            Your note will be protected by a password.
          </p>
        </div>
      </section>

      <section className="private-note-features">
        <div>
          <span className="feature-number">01</span>
          <h3>Private by design</h3>
          <p>
            Keep personal thoughts, messages, memories, and words in a space
            designed to stay private.
          </p>
        </div>

        <div>
          <span className="feature-number">02</span>
          <h3>Your own address</h3>
          <p>
            Create a memorable WHOLEGACY address such as
            whol​egacy.com/p/arsenius.
          </p>
        </div>

        <div>
          <span className="feature-number">03</span>
          <h3>Made for what matters</h3>
          <p>
            Write something meaningful today and return to it whenever you
            need it.
          </p>
        </div>
      </section>

      <section className="private-note-quote">
        <p>
          “Some things are worth writing down.
          <br />
          Some things are worth keeping.”
        </p>
      </section>

      <footer className="private-note-footer">
        <span>© {new Date().getFullYear()} WHOLEGACY</span>
        <span>Your Story. Your Identity. Your Legacy.</span>
      </footer>

      <style jsx>{`
        .private-note-page {
          min-height: 100vh;
          background: #faf8f3;
          color: #14233b;
          font-family: Arial, Helvetica, sans-serif;
        }

        .private-note-header {
          height: 88px;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(20, 35, 59, 0.08);
          background: rgba(255, 255, 255, 0.85);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #14233b;
          text-decoration: none;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .brand-mark {
          color: #bd8d42;
          font-size: 28px;
        }

        .back-link {
          color: #5d6674;
          text-decoration: none;
          font-size: 15px;
        }

        .private-note-hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 110px 24px 90px;
          text-align: center;
        }

        .eyebrow {
          margin-bottom: 22px;
          color: #b8863c;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(64px, 9vw, 120px);
          line-height: 0.9;
          font-weight: 500;
          letter-spacing: -5px;
        }

        h1 span {
          color: #bd8d42;
        }

        .hero-description {
          max-width: 690px;
          margin: 36px auto 55px;
          color: #4d5969;
          font-size: 19px;
          line-height: 1.8;
        }

        .note-card {
          max-width: 620px;
          margin: 0 auto;
          padding: 48px 42px 40px;
          background: #fff;
          border: 1px solid #ded8cc;
          border-radius: 24px;
          box-shadow: 0 24px 70px rgba(20, 35, 59, 0.09);
        }

        .lock-icon {
          width: 58px;
          height: 58px;
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f5ead7;
          font-size: 24px;
        }

        .note-card h2 {
          margin: 0 0 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 34px;
          font-weight: 500;
        }

        .note-card p {
          color: #687180;
          line-height: 1.7;
        }

        .url-preview {
          margin: 24px 0;
          padding: 16px 18px;
          border: 1px solid #e3ded5;
          border-radius: 12px;
          background: #faf8f3;
          color: #8a8f98;
          font-size: 15px;
        }

        .url-preview strong {
          color: #14233b;
        }

        .primary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          min-height: 58px;
          border-radius: 12px;
          background: #bd8d42;
          color: white;
          text-decoration: none;
          font-size: 16px;
          font-weight: 700;
          box-shadow: 0 12px 28px rgba(189, 141, 66, 0.22);
        }

        .privacy-note {
          margin: 18px 0 0 !important;
          font-size: 13px;
        }

        .private-note-features {
          max-width: 1120px;
          margin: 0 auto;
          padding: 70px 24px 110px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 55px;
          border-top: 1px solid #ded8cc;
        }

        .feature-number {
          color: #bd8d42;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .private-note-features h3 {
          margin: 14px 0 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          font-weight: 500;
        }

        .private-note-features p {
          margin: 0;
          color: #687180;
          font-size: 15px;
          line-height: 1.8;
        }

        .private-note-quote {
          padding: 95px 24px;
          text-align: center;
          background: #14233b;
          color: white;
        }

        .private-note-quote p {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.25;
        }

        .private-note-footer {
          padding: 30px 5vw;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #7c8490;
          font-size: 12px;
          background: #faf8f3;
        }

        @media (max-width: 760px) {
          .private-note-header {
            height: 76px;
            padding: 0 20px;
          }

          .brand {
            font-size: 18px;
            letter-spacing: 2px;
          }

          .back-link {
            font-size: 13px;
          }

          .private-note-hero {
            padding: 75px 20px 65px;
          }

          h1 {
            font-size: clamp(60px, 18vw, 90px);
            letter-spacing: -3px;
          }

          .hero-description {
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 40px;
          }

          .note-card {
            padding: 36px 22px 30px;
          }

          .private-note-features {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 60px 24px 75px;
          }

          .private-note-quote {
            padding: 75px 24px;
          }

          .private-note-footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
