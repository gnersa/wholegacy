"use client";

import { useState } from "react";

type Props = {
  slug: string;
};

export default function PrivateNoteClient({ slug }: Props) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!password.trim()) {
      setMessage("Please enter a password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/private-note/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message || "Something went wrong."
        );
        return;
      }

      setCreated(true);
    } catch (error) {
      console.error("Password request error:", error);
      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

          {!created ? (
            <>
              <p className="mt-4 text-gray-200">
                Create your private space
              </p>

              <p className="mt-2 text-sm text-gray-300">
                /{slug}
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
                    handleCreate();
                  }
                }}
                placeholder="Password"
                autoFocus
                autoComplete="new-password"
                className="mt-8 w-full rounded border border-gray-300 bg-white px-4 py-3 text-center text-black outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-200"
              />

              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="mt-4 w-full rounded border border-gray-400 bg-gradient-to-b from-gray-100 to-gray-300 px-5 py-3 font-semibold text-black shadow transition hover:from-white hover:to-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
              </button>

              {message && (
                <p className="mt-4 text-sm text-red-200">
                  {message}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="mt-6 text-green-100">
                Your private note is ready.
              </p>

              <p className="mt-2 text-gray-300">
                /{slug}
              </p>

              <div className="mt-6 rounded bg-white/10 p-4 text-sm text-gray-200">
                Password created successfully.
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
