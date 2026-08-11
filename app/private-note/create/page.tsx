"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [path, setPath] = useState("");
  const router = useRouter();

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPath = path.trim().replace(/^\/+|\/+$/g, "");

    if (cleanPath) {
      router.push(`/p/${cleanPath}`);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0b3c65] font-sans">
      <div className="flex min-h-screen w-full items-center justify-center px-5">
        <form
          onSubmit={handleGo}
          className="
            flex w-full max-w-[700px]
            flex-col items-center
            gap-3
            text-center
            sm:flex-row
            sm:items-center
            sm:justify-center
            sm:gap-2
            sm:text-left
          "
        >
          <span className="whitespace-nowrap text-[16px] font-normal text-[#dbeaf5] sm:text-[18px]">
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
            className="
              h-[38px]
              w-full
              max-w-[260px]
              rounded-[3px]
              border
              border-[#aeb8c2]
              bg-white
              px-2.5
              text-[16px]
              text-black
              shadow-inner
              outline-none
              focus:border-[#c99a4a]
              focus:ring-1
              focus:ring-[#c99a4a]
              sm:w-[210px]
            "
          />

          <button
            type="submit"
            className="
              h-[38px]
              min-w-[64px]
              rounded-[3px]
              border
              border-[#aeb8c2]
              bg-gradient-to-b
              from-[#ffffff]
              to-[#d9dde1]
              px-4
              text-[15px]
              font-semibold
              text-black
              shadow-sm
              transition
              hover:from-white
              hover:to-[#e5e7e9]
              active:from-[#d5d8db]
              active:to-[#f1f2f3]
            "
          >
            Go
          </button>

          <span className="mt-1 text-[12px] text-[#b9d2e5] sm:ml-1 sm:mt-0 sm:whitespace-nowrap">
            (or write directly in the address bar)
          </span>
        </form>
      </div>
    </main>
  );
}
