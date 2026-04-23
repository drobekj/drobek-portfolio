import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drobek-portfolio.vercel.app"),
  title: {
    default: "Jaroslav Drobek – Portfolio",
    template: "%s | Jaroslav Drobek",
  },
  description:
    "Portfolio: mathematical materials, research, and technical projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <Header />

        <main className="mx-auto max-w-6xl px-8 py-8">
          {children}
        </main>

        <footer className="mt-16 border-t py-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} DrSoft
        </footer>
      </body>
    </html>
  );
}