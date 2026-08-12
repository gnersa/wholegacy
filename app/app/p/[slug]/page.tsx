import { sql } from "../../../../lib/db";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { slug } = await params;

  const result = await sql`
    SELECT slug, created_at
    FROM private_workspaces
    WHERE slug = ${slug}
    LIMIT 1
  `;

  if (result.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#c9d1bc] p-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Private Note not found
          </h1>

          <p className="mt-3 text-gray-600">
            This private space does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#c9d1bc] p-6">
      <div className="w-full max-w-3xl rounded-lg border border-[#545341] bg-[#696852] p-8 text-center shadow-xl">
        <p className="text-sm text-gray-300">
          WHOLEGACY
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold italic text-white">
          Private Note
        </h1>

        <p className="mt-4 text-gray-200">
          This is the private space for
        </p>

        <p className="mt-2 text-2xl font-semibold text-white">
          /{slug}
        </p>

        <div className="mt-8 rounded-md bg-white/10 p-6 text-gray-200">
          Your private note workspace is ready.
        </div>
      </div>
    </main>
  );
}
