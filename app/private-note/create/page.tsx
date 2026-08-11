"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [path, setPath] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanPath = path.trim().replace(/^\/+|\/+$/g, "");

    if (!cleanPath) {
      setError("Please enter a name.");
      return;
    }

    // Only allow letters, numbers and hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(cleanPath)) {
      setError("Use only letters, numbers, and hyphens.");
      return;
    }

    setError("");

    router.push(`/p/${cleanPath.toLowerCase()}`);
  };

  return (
    <main className="min-h-screen w-full bg-[#c9d1bc] font-sans">
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">

        {/* Title */}
        <h1 className="mb-8 text-center font-serif text-3xl font-bold italic tracking-tight text-gray-800 sm:text-4xl md:text-5xl">
          It&apos;s your legacy notes.
        </h1>

        {/* Main Box */}
        <div className="w-full max-w-4xl rounded-lg border border-[#545341] bg-[#696852] p-5 shadow-xl sm:p-8">

          <form
            onSubmit={handleGo}
            className="flex flex-col items-center justify-center gap-3 text-white sm:flex-row sm:flex-wrap"
          >
            {/* URL */}
            <span className="text-center text-base font-normal text-gray-100 sm:text-lg">
              Go to wholegacy.com/p/
            </span>

            {/* Input */}
            <input
              type="text"
              value={path}
              onChange={(e) => {
                setPath(e.target.value);
                setError("");
              }}
              placeholder="your-name"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="h-10 w-full max-w-[220px] rounded-sm border border-gray-400 bg-white px-3 py-1.5 text-center text-base text-black shadow-inner outline-none transition focus:border-amber-200 focus:ring-1 focus:ring-amber-200 sm:w-48"
            />

            {/* Go Button */}
            <button
              type="submit"
              className="h-10 min-w-[70px] rounded-sm border border-gray-400 bg-gradient-to-b from-gray-100 to-gray-300 px-5 font-semibold text-black shadow transition-all hover:from-white hover:to-gray-200 active:from-gray-300 active:to-gray-100"
            >
              Go
            </button>

            {/* Helper */}
            <span className="text-center text-xs text-gray-200 sm:pl-1 sm:text-sm">
              (or write directly in the address bar)
            </span>
          </form>

          {/* Error */}
          {error && (
            <p className="mt-4 text-center text-sm font-medium text-red-200">
              {error}
            </p>
          )}
        </div>

        {/* Small Footer */}
        <p className="mt-6 text-center text-xs text-gray-700/70">
          Your story. Your identity. Your legacy.
        </p>
      </div>
    </main>
  );
}
