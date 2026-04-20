import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Niche",
  description:
    "Niche is a premium online perfume store offering luxury and niche fragrances. Discover authentic perfumes, exclusive scents, and secure shopping online.",
  keywords: [
    "niche perfume store",
    "buy perfumes online",
    "luxury perfumes",
    "niche fragrances",
    "best online perfume store",
    "long-lasting perfumes",
    "authentic perfumes online",
    "perfume deals and discounts",
    "unisex fragrances",
    "fragrance marketplace",
    "designer perfumes",
    "perfume shop online",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
