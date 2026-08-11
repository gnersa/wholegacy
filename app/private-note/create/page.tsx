import Link from "next/link";

export default function CreatePrivateNotePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f5ef] text-[#14233b]">
      {/* HEADER */}
      <header className="w-full border-b border-[#14233b]/10 bg-[#f7f5ef]">
        <div className="mx-auto flex h-[72px] w-full max-w-[1100px] items-center justify-between px-5 sm:h-[82px] sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[16px] font-semibold tracking-[2.5px] sm:text-[18px]"
          >
            <span className="text-[18px] text-[#b88a45]">✦</span>
            WHOLEGACY
          </Link>

          <Link
            href="/private-note"
            className="text-[12px] text-[#777d86] transition hover:text-[#14233b] sm:text-[13px]"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="px-5 pb-10 pt-14 text-center sm:px-8 sm:pb-14 sm:pt-20">
        <div className="mx-auto w-full max-w-[720px]">
          <p className="mb-5 text-[9px] font-bold uppercase tracking-[3px] text-[#b88a45] sm:text-[10px] sm:tracking-[4px]">
            WHOLEGACY · PRIVATE NOTE
          </p>

          <h1 className="font-serif text-[52px] font-normal leading-[0.94] tracking-[-2.5px] sm:text-[68px] sm:tracking-[-3px] md:text-[78px]">
            A place for
            <br />
            <span className="italic text-[#b88a45]">what matters.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[520px] text-[14px] leading-7 text-[#747b85] sm:mt-7 sm:text-[16px] sm:leading-8">
            Write a thought, a memory, a message, or something you simply
            want to keep.
          </p>
        </div>
      </section>

      {/* EDITOR */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto w-full max-w-[720px]">
          <div className="overflow-hidden rounded-[18px] border border-[#ddd8ce] bg-[#fffefa] shadow-[0_20px_60px_rgba(20,35,59,0.07)]">
            {/* ADDRESS */}
            <div className="border-b border-[#ebe6de] px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex flex-col items-center text-center">
                <p className="mb-2 text-[8px] font-bold uppercase tracking-[2.5px] text-[#aaa59d] sm:text-[9px] sm:tracking-[3px]">
                  Your private address
                </p>

                <div className="flex w-full max-w-[360px] items-center justify-center rounded-md border border-transparent px-1">
                  <span className="whitespace-nowrap text-[12px] text-[#99958d] sm:text-[14px]">
                    wholegacy.com/p/
                  </span>

                  <input
                    type="text"
                    placeholder="your-name"
                    autoComplete="off"
                    spellCheck={false}
                    className="min-w-0 w-[115px] border-0 bg-transparent p-0 text-[13px] font-medium text-[#14233b] outline-none placeholder:text-[#c7c2b9] sm:w-[145px] sm:text-[15px]"
                  />
                </div>
              </div>
            </div>

            {/* WRITING */}
            <div className="px-5 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-8">
              <textarea
                rows={12}
                placeholder="Begin writing..."
                className="block min-h-[300px] w-full resize-none border-0 bg-transparent text-center font-serif text-[20px] leading-[1.75] text-[#26364d] outline-none placeholder:text-[#c9c5bd] sm:min-h-[390px] sm:text-[22px] sm:leading-[1.8]"
              />

              <div className="mt-4 flex items-center justify-between border-t border-[#eeeae3] pt-4">
                <span className="text-[8px] uppercase tracking-[1.8px] text-[#aaa59d] sm:text-[9px] sm:tracking-[2px]">
                  Your words. Your space.
                </span>

                <span className="text-[10px] text-[#aaa59d] sm:text-[11px]">
                  0 words
                </span>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="border-t border-[#e7e2d9] bg-[#fbf9f4] px-5 py-6 sm:px-7 sm:py-7">
              <div className="mx-auto w-full max-w-[430px] text-center">
                <p className="mb-4 text-[8px] font-bold uppercase tracking-[2.5px] text-[#aaa59d] sm:text-[9px] sm:tracking-[3px]">
                  Protect your note
                </p>

                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-medium text-[#14233b]"
                >
                  Create a password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Choose a private password"
                  className="h-12 w-full rounded-[9px] border border-[#d9d4cb] bg-[#fffefa] px-4 text-center text-[13px] text-[#14233b] outline-none transition focus:border-[#b88a45] focus:ring-2 focus:ring-[#b88a45]/10"
                />

                <p className="mt-2 text-[10px] leading-5 text-[#98958e]">
                  Keep this password safe. You will need it to access your
                  note.
                </p>
              </div>

              {/* ACTION */}
              <div className="mx-auto mt-6 w-full max-w-[430px]">
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-4 rounded-[9px] bg-[#14233b] text-[11px] font-semibold uppercase tracking-[1.5px] text-white shadow-[0_10px_25px_rgba(20,35,59,0.15)] transition hover:bg-[#1d304c] active:scale-[0.99]"
                >
                  Keep This Note
                  <span className="text-[#d0a45d]">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* PRIVACY */}
          <div className="mt-6 text-center">
            <p className="text-[10px] leading-5 text-[#9a968f]">
              <span className="mr-1 text-[#b88a45]">✦</span>
              A quiet place for the things worth keeping.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#ded9cf]">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-2 px-5 py-7 text-center text-[9px] uppercase tracking-[1.3px] text-[#98958e] sm:flex-row sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} WHOLEGACY</span>

          <span>Your Story. Your Identity. Your Legacy.</span>
        </div>
      </footer>
    </main>
  );
}
