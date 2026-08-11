"use client";

import { useState } from "react";

export default function Page() {
  const [path, setPath] = useState("");

  const handleGo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanPath = path.trim().replace(/^\/+|\/+$/g, "");

    if (!cleanPath) return;

    window.location.href = `/p/${cleanPath}`;
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#c9d1bc] p-4">
      <form
        onSubmit={handleGo}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        <span className="text-gray-800">
          Go to wholegacy.com/p/
        </span>

        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="your-name"
          autoFocus
          className="h-10 w-48 rounded border border-gray-400 bg-white px-2 text-black outline-none"
        />

        <button
          type="submit"
          className="h-10 rounded border border-gray-400 bg-gray-200 px-5 font-semibold text-black"
        >
          Go
        </button>
      </form>
    </main>
  );
}
