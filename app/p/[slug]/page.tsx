type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { slug } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#c9d1bc] p-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          WHOLEGACY
        </p>

        <h1 className="mt-4 text-4xl font-bold text-gray-800">
          Private Note
        </h1>

        <p className="mt-4 text-xl text-gray-700">
          /{slug}
        </p>

        <p className="mt-6 text-gray-600">
          Workspace found.
        </p>
      </div>
    </main>
  );
}
