"use client";

import React, { useState } from "react";

export default function Page() {
  const [path, setPath] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanPath = path
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

    setMessage("");
    setSuccess(false);

    if (!cleanPath) {
      setMessage("Please enter a name.");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(cleanPath)) {
      setMessage(
        "Use only lowercase letters, numbers, and hyphens."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/private-note/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: cleanPath,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.available) {
        setMessage(
          result.message ||
            "This name is not available."
        );
        return;
      }

      // TEST MODE:
      // Tidak redirect ke /p/[slug] dulu.
      setSuccess(true);
      setMessage(
        `Success! "${cleanPath}" has been created.`
      );
    } catch (error) {
      console.error("Private Note request error:", error);

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
            onChange={(e) => {
              setPath(e.target.value);
              setMessage("");
              setSuccess(false);
            }}
            placeholder="your-name"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
            className="w-full max-w-[220px] rounded-sm border border-gray-400 bg-white px-3 py-1.5 text-center text-black shadow-inner outline-none focus:border-amber-200 focus:ring-1 focus:ring-amber-200 disabled:bg-gray-200 sm:w-48"
          />

          <button
            type="submit"
            disabled={loading}
            className="min-w-[70px] rounded-sm border border-gray-400 bg-gradient-to-b from-gray-100 to-gray-300 px-5 py-1.5 font-semibold text-black shadow transition-all hover:from-white hover:to-gray-200 active:from-gray-300 active:to-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "..." : "Go"}
          </button>

          <span className="text-center text-sm text-gray-200 sm:pl-1">
            (or write directly in the address bar)
          </span>
        </form>

        {message && (
          <div
            className={`mt-5 text-center text-sm font-medium ${
              success
                ? "text-green-100"
                : "text-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
