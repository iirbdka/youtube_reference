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
  title: "RefTube - 유튜브 레퍼런스 검색",
  description: "고성과 유튜브 영상을 발굴하고 효율 지표를 분석하는 레퍼런스 검색 서비스",
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
