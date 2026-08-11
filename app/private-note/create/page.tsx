import React, { useState } from 'react';

export default function Page() {
  const [path, setPath] = useState('');

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (path.trim()) {
      alert(`Navigating to /${path.trim()}`);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#c9d1bc] font-sans p-4">
      {}
      {}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 tracking-tight font-serif italic text-center">
        It&apos;s your legacy notes.
      </h1>

      {}
      <div className="bg-[#696852] p-8 rounded-lg shadow-xl flex flex-col md:flex-row items-center justify-center border border-[#545341] max-w-4xl w-full">
        {}
        <form onSubmit={handleGo} className="flex flex-wrap items-center justify-center gap-2 text-white text-lg">
          <span className="font-normal text-gray-100">
            Go to wholegacy.com/p/
          </span>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="px-3 py-1.5 text-black bg-white border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-200 w-48 shadow-inner"
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-1.5 bg-gradient-to-b from-gray-100 to-gray-300 text-black font-semibold border border-gray-400 rounded-sm shadow hover:from-white hover:to-gray-200 active:from-gray-300 active:to-gray-100 cursor-pointer transition-all"
          >
            Go
          </button>
          <span className="text-gray-200 text-sm pl-1">
            (or write directly in the address bar)
          </span>
        </form>
      </div>
    </main>
  );
}
