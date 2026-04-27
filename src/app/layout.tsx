import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/SessionProvider";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${notoSerif.variable} ${manrope.variable} antialiased`}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
