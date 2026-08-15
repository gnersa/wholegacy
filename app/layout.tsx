import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wholegacy.com"),

  title: {
    default: "WHOLEGACY | Your Story. Your Identity. Your Legacy.",
    template: "%s | WHOLEGACY",
  },

  description:
    "WHOLEGACY is a digital legacy platform for preserving your stories, memories, important documents, values, and wishes for the people who matter most.",

  keywords: [
    "digital legacy",
    "digital legacy platform",
    "digital inheritance",
    "legacy management",
    "digital memories",
    "preserve memories",
    "family legacy",
    "personal legacy",
    "digital estate",
    "life story",
    "personal identity",
    "WHOLEGACY",
  ],

  authors: [
    {
      name: "WHOLEGACY",
      url: "https://www.wholegacy.com",
    },
  ],

  creator: "WHOLEGACY",
  publisher: "WHOLEGACY",

  alternates: {
    canonical: "https://www.wholegacy.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "WHOLEGACY | Your Story. Your Identity. Your Legacy.",
    description:
      "Preserve your stories, memories, values, documents, and wishes for the people who matter most.",
    url: "https://www.wholegacy.com",
    siteName: "WHOLEGACY",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WHOLEGACY — Your Story. Your Identity. Your Legacy.",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "WHOLEGACY | Your Story. Your Identity. Your Legacy.",
    description:
      "Preserve your stories, memories, values, documents, and wishes for the people who matter most.",
    images: ["/og-image.png"],
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
