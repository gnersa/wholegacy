import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title:
    "Private Chat – Secure, Encrypted & No Account | WHOLEGACY",

  description:
    "Create a private chat room in seconds. No account, no sign-up. Chat securely with P2P connections and encrypted relay fallback by WHOLEGACY.",

  alternates: {
    canonical:
      "https://wholegacy.com/webchat",
  },

  openGraph: {
    title:
      "Private Chat – Secure, Encrypted & No Account | WHOLEGACY",

    description:
      "Create a private chat room in seconds. No account, no sign-up. Chat securely with P2P connections and encrypted relay fallback by WHOLEGACY.",

    url:
      "https://wholegacy.com/webchat",

    siteName:
      "WHOLEGACY",

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Private Chat – Secure, Encrypted & No Account | WHOLEGACY",

    description:
      "Create a private chat room in seconds. No account, no sign-up. Secure private chat with P2P and encrypted relay fallback.",
  },
};

export default function WebchatLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
