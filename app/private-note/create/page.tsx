"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [path, setPath] = useState("");
  const router = useRouter();

  function handleGo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanPath = path.trim().replace(/^\/+|\/+$/g, "");

    if (!cleanPath) return;

    router.push(`/p/${cleanPath}`);
  }

  return (
    <main className="min-h-screen w-full bg-[#0b3c65] font-sans">
      <div className="flex min-h-screen w-full items-center justify-center px-5">
        <form
          onSubmit={handleGo}
          className="flex w-full max-w-[720px] flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-2"
        >
          <span className="text-[16px] text-[#dbeaf5] sm:text-[18px]">
            Go to wholegacy.com/p/
          </span>

          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="your-name"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className="h-[38px] w-full max-w-[240px] rounded-[3px] border border-gray-400 bg-white px-2 text-[16px] text-black shadow-inner outline-none focus:border-[#c99a4a] focus:ring-1 focus:ring-[#c99a4a] sm:w-[210px]"
          />

          <button
            type="submit"
            className="h-[38px] min-w-[64px] rounded-[3px] border border-gray-400 bg-gradient-to-b from-gray-100 to-gray-300 px-4 text-[15px] font-semibold text-black shadow hover:from-white hover:to-gray-200 active:from-gray-300 active:to-gray-100"
          >
            Go
          </button>

          <span className="text-[12px] text-[#b9d2e5] sm:ml-1">
            (or write directly in the address bar)
          </span>
        </form>
      </div>
    </main>
  );
}
