import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "WHOLEGACY | Your Story. Your Identity. Your Legacy.",
  description: "WHOLEGACY is building a digital legacy platform to preserve your stories, memories, important documents, and wishes for the people who matter most.",
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
