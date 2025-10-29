import type { Metadata } from "next";
import "./globals.css";
// Initialize application services at startup
import "@/hooks/app_start_hook";

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

