import Link from "next/link";

export default function CreatePrivateNotePage() {
  return (
    <main className="min-h-screen bg-[#faf8f3] text-[#14233b]">
      {/* Header */}
      <header className="flex h-[88px] items-center justify-between border-b border-[#14233b]/10 bg-white/90 px-[5vw]">
        <Link
          href="/"
          className="flex items-center gap-3 text-[24px] font-bold tracking-[3px] text-[#14233b]"
        >
          <span className="text-[22px] text-[#bd8d42]">✦</span>
          WHOLEGACY
        </Link>

        <Link
          href="/private-note"
          className="text-sm text-[#5d6674] transition hover:text-[#bd8d42]"
        >
          ← Private Note
        </Link>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-[850px] px-6 pb-20 pt-[90px]">
        {/* Intro */}
        <div className="mb-[55px] text-center">
          <div className="mb-5 text-xs font-bold tracking-[3px] text-[#b8863c]">
            WHOLEGACY · PRIVATE NOTE
          </div>

          <h1 className="font-serif text-[clamp(52px,7vw,86px)] font-normal leading-[0.98] tracking-[-3px]">
            Create something
            <br />
            <span className="text-[#bd8d42]">private.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-[590px] text-[17px] leading-[1.8] text-[#687180]">
            Choose your private address, set a password, and write something
            that matters to you.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-[22px] border border-[#ded8cc] bg-white p-6 shadow-[0_25px_70px_rgba(20,35,59,0.08)] sm:p-12">
          {/* Address */}
          <div className="mb-5 text-[11px] font-bold tracking-[2.2px] text-[#b8863c]">
            01 — YOUR PRIVATE ADDRESS
          </div>

          <label
            htmlFor="slug"
            className="mb-2 block text-[15px] font-semibold"
          >
            Choose your address
          </label>

          <div className="flex h-14 overflow-hidden rounded-[11px] border border-[#d9d4cb] bg-[#fcfbf8] focus-within:border-[#bd8d42]">
            <span className="flex shrink-0 items-center pl-3 text-xs text-[#8a8f98] sm:pl-4 sm:text-sm">
              wholegacy.com/p/
            </span>

            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="your-name"
              autoComplete="off"
              spellCheck={false}
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-1 text-base text-[#14233b] outline-none"
            />
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[#858b95]">
            Use letters, numbers, and hyphens. This address will be used to
            access your Private Note.
          </p>

          <div className="my-9 h-px bg-[#e7e2d9]" />

          {/* Password */}
          <div className="mb-5 text-[11px] font-bold tracking-[2.2px] text-[#b8863c]">
            02 — PROTECT YOUR NOTE
          </div>

          <label
            htmlFor="password"
            className="mb-2 block text-[15px] font-semibold"
          >
            Create a password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter a password"
            autoComplete="new-password"
            className="h-14 w-full rounded-[11px] border border-[#d9d4cb] bg-[#fcfbf8] px-4 text-base text-[#14233b] outline-none transition focus:border-[#bd8d42]"
          />

          <p className="mt-2 text-xs leading-relaxed text-[#858b95]">
            Choose a password you can remember. Keep it private.
          </p>

          <div className="my-9 h-px bg-[#e7e2d9]" />

          {/* Note */}
          <div className="mb-5 text-[11px] font-bold tracking-[2.2px] text-[#b8863c]">
            03 — YOUR NOTE
          </div>

          <label
            htmlFor="note"
            className="mb-2 block text-[15px] font-semibold"
          >
            Write something that matters
          </label>

          <textarea
            id="note"
            name="note"
            rows={10}
            placeholder="Write your thoughts, a message, a memory, or anything you want to keep private..."
            className="w-full resize-y rounded-[11px] border border-[#d9d4cb] bg-[#fcfbf8] p-4 text-base leading-[1.7] text-[#14233b] outline-none transition focus:border-[#bd8d42]"
          />

          {/* Bottom */}
          <div className="mt-7 flex flex-col items-stretch gap-6 border-t border-[#e7e2d9] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs leading-relaxed text-[#777f8b]">
              <span>🔒</span>
              Your note will be protected by your password.
            </p>

            <button
              type="button"
              className="inline-flex min-h-14 items-center justify-center gap-4 rounded-[11px] bg-[#bd8d42] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(189,141,66,0.22)] transition hover:bg-[#a97835]"
            >
              Create Private Note
              <span>→</span>
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-[#969ba3]">
          By creating a Private Note, you agree to use WHOLEGACY responsibly.
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-4 border-t border-[#ded8cc] px-[5vw] py-8 text-center text-xs text-[#7c8490] sm:flex-row sm:justify-between sm:text-left">
        <span>© {new Date().getFullYear()} WHOLEGACY</span>
        <span>Your Story. Your Identity. Your Legacy.</span>
      </footer>
    </main>
  );
}
