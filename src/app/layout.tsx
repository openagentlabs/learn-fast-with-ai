import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Fast with AI",
  description: "Flashcard-based learning with AI features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

