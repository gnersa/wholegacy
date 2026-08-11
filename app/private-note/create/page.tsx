"use client";

import React, { useState } from "react";

export default function Page() {
  const [path, setPath] = useState("");

  const handleGo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanPath = path.trim().replace(/^\/+|\/+$/g, "");

    if (!cleanPath) return;

    window.location.href = `/p/${cleanPath}`;
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#c9d1bc] p-4 font-sans">
      <h1 className="mb-8 text-center font-serif text-3xl font-bold italic tracking-tight text-gray-800 md:text-5xl">
        It&apos;s your legacy notes.
      </h1>

      <div className="w-full max-w-4xl rounded-lg border border-[#545341] bg-[#696852] p-6 shadow-xl sm:p-8">
        <form
          onSubmit={handleGo}
          className="flex flex-col items-center justify-center gap-3 text-lg text-white sm:flex-row sm:flex-wrap sm:gap-2"
        >
          <span className="text-center font-normal text-gray-100">
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
            className="w-full max-w-[220px] rounded-sm border border-gray-400 bg-white px-3 py-1.5 text-center text-black shadow-inner outline-none focus:border-amber-200 focus:ring-1 focus:ring-amber-200 sm:w-48"
          />

          <button
            type="submit"
            className="rounded-sm border border-gray-400 bg-gradient-to-b from-gray-100 to-gray-300 px-5 py-1.5 font-semibold text-black shadow transition-all hover:from-white hover:to-gray-200 active:from-gray-300 active:to-gray-100"
          >
            Go
          </button>

          <span className="text-center text-sm text-gray-200 sm:pl-1">
            (or write directly in the address bar)
          </span>
        </form>
      </div>
    </main>
  );
}
