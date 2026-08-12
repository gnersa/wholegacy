"use client";

import { useState } from "react";

type Props = {
  slug: string;
};

export default function PrivateNoteClient({ slug }: Props) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/private-note/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(
          result.message || "Incorrect password."
        );
        return;
      }

      setUnlocked(true);
      setMessage("");
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#c9d1bc] p-6 font-sans">
        <div className="w-full max-w-4xl rounded-lg border border-[#545341] bg-[#696852] p-8 shadow-xl">
          <div className="text-center">
            <p className="text-sm tracking-wide text-gray-300">
              WHOLEGACY
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold italic text-white">
              Private Note
            </h1>

            <p className="mt-2 text-sm text-gray-300">
              /{slug}
            </p>
          </div>

          <div className="mt-8 rounded-md bg-white p-6 shadow-inner">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
              <button className="rounded-t border-b-2 border-gray-700 px-4 py-2 text-sm font-semibold text-gray-800">
                Note 1
              </button>

              <button className="px-3 py-2 text-lg text-gray-500 hover:text-gray-800">
                +
              </button>
            </div>

            <textarea
              placeholder="Start writing your private note..."
              className="min-h-[350px] w-full resize-none border-0 bg-transparent p-2 text-gray-800 outline-none"
            />
          </div>

          <p className="mt-4 text-center text-xs text-gray-300">
            Your private workspace is unlocked.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#c9d1bc] p-6 font-sans">
      <div className="w-full max-w-md rounded-lg border border-[#545341] bg-[#696852] p-8 shadow-xl">
        <div className="text-center">
          <p className="text-sm tracking-wide text-gray-300">
            WHOLEGACY
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold italic text-white">
            Private Note
          </h1>

          <p className="mt-2 text-sm text-gray-300">
            /{slug}
          </p>

          <p className="mt-6 text-gray-200">
            Enter your password
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
            disabled={loading}
            className="mt-6 w-full rounded border border-gray-300 bg-white px-4 py-3 text-center text-black outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-200 disabled:bg-gray-200"
          />

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mt-4 w-full rounded border border-gray-400 bg-gradient-to-b from-gray-100 to-gray-300 px-5 py-3 font-semibold text-black shadow transition hover:from-white hover:to-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Unlocking..." : "Unlock"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-red-200">
              {message}
            </p>
          )}

          <p className="mt-6 text-xs text-gray-300">
            This Private Note is password protected.
          </p>
        </div>
      </div>
    </main>
  );
}
