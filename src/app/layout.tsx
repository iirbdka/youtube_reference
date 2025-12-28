import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/contexts/SearchContext";
import { CollectionProvider } from "@/contexts/CollectionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RefTube - YouTube Reference Search",
  description: "Discover and analyze YouTube video references with performance insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <SearchProvider>
          <CollectionProvider>
            {children}
          </CollectionProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
