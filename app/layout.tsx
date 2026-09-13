import type { Metadata } from "next";
import { bebasNeue, spaceGrotesk } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Show Off",
  description: "A head-to-head trivia game on a six-arena trophy ladder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
