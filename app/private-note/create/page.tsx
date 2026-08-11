import Link from "next/link";

export default function CreatePrivateNotePage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#14233b]">
      {/* Header */}
      <header className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3 text-[18px] font-semibold tracking-[3px]"
        >
          <span className="text-xl text-[#b88a45] transition-transform duration-300 group-hover:rotate-12">
            ✦
          </span>
          WHOLEGACY
        </Link>

        <Link
          href="/private-note"
          className="text-sm text-[#707783] transition-colors hover:text-[#14233b]"
        >
          ← Private Note
        </Link>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-5xl px-5 pb-24 pt-16 sm:px-8 lg:pt-24">
        {/* Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[4px] text-[#b88a45]">
            A private space by WHOLEGACY
          </p>

          <h1 className="font-serif text-[clamp(52px,8vw,92px)] font-normal leading-[0.94] tracking-[-4px]">
            A place for
            <br />
            <em className="text-[#b88a45]">what matters.</em>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-[16px] leading-8 text-[#6d7480] sm:text-[18px]">
            Write a thought, a memory, a message, or something you simply
            want to keep.
          </p>
        </div>

        {/* Editor */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-[2px] border border-[#ded9cf] bg-[#fffefa] shadow-[0_30px_100px_rgba(20,35,59,0.08)]">
            {/* Note identity bar */}
            <div className="flex flex-col gap-5 border-b border-[#e7e2d9] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[3px] text-[#a9a49b]">
                  Your private address
                </p>

                <div className="flex items-center gap-1 text-[15px] sm:text-[16px]">
                  <span className="text-[#98958e]">wholegacy.com/p/</span>

                  <input
                    type="text"
                    placeholder="your-name"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-32 border-0 bg-transparent p-0 font-medium text-[#14233b] outline-none placeholder:text-[#c2beb6] sm:w-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#98958e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3eee4] text-[#b88a45]">
                  🔒
                </span>
                Private
              </div>
            </div>

            {/* Writing area */}
            <div className="px-6 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-10">
              <textarea
                rows={13}
                placeholder="Begin writing..."
                className="min-h-[380px] w-full resize-none border-0 bg-transparent font-serif text-[20px] leading-[1.8] text-[#26364d] outline-none placeholder:text-[#c8c4bc] sm:min-h-[430px] sm:text-[22px]"
              />

              <div className="mt-6 flex items-center justify-between border-t border-[#eee9e0] pt-5">
                <span className="text-[10px] uppercase tracking-[2px] text-[#aaa69e]">
                  Your words. Your space.
                </span>

                <span className="text-xs text-[#aaa69e]">0 words</span>
              </div>
            </div>

            {/* Protection */}
            <div className="border-t border-[#e7e2d9] bg-[#fbf9f4] px-6 py-7 sm:px-10">
              <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-[3px] text-[#a9a49b]">
                    Protect your note
                  </p>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[#14233b]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Choose a private password"
                    className="h-12 w-full rounded-none border border-[#dcd7ce] bg-[#fffefa] px-4 text-sm text-[#14233b] outline-none transition focus:border-[#b88a45] md:w-[360px]"
                  />

                  <p className="mt-2 text-[11px] leading-5 text-[#96938d]">
                    Keep this password safe. You will need it to access your
                    note.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-5 rounded-none bg-[#14233b] px-7 text-xs font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-[#1d304c]"
                >
                  Keep This Note
                  <span className="text-[#d0a45d]">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Small privacy statement */}
          <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-[#99958d]">
            <span>✦</span>
            <span>A quiet place for the things worth keeping.</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ded9cf]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-center text-[10px] uppercase tracking-[1.5px] text-[#96938d] sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:text-left">
          <span>© {new Date().getFullYear()} WHOLEGACY</span>
          <span>Your Story. Your Identity. Your Legacy.</span>
        </div>
      </footer>
    </main>
  );
}
