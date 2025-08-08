import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code100x CMS",
  description: "Frontend portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
