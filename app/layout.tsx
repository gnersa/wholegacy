import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WHOLEGACY | Your Story. Your Identity. Your Legacy.",
  description:
    "WHOLEGACY is a digital legacy platform for preserving your stories, memories, important documents, values, and wishes for the people who matter most.",

  openGraph: {
    title: "WHOLEGACY | Your Story. Your Identity. Your Legacy.",
    description:
      "Preserve your stories, memories, values, documents, and wishes for the people who matter most.",
    url: "https://wholegacy.com",
    siteName: "WHOLEGACY",
    images: [
      {
        url: "https://wholegacy.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "WHOLEGACY — Your Story. Your Identity. Your Legacy.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}