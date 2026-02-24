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

export const metadata = {
  metadataBase: new URL("https://drobek-portfolio.vercel.app"),
  title: {
    default: "Jaroslav Drobek – Portfolio",
    template: "%s | Jaroslav Drobek",
  },
  description:
    "Portfolio: matematické materiály (SŠ, VŠ), research a odborné projekty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
	<Header />
        <main className="mx-auto max-w-5xl px-6 py-6">{children}</main>
	<footer className="mt-16 border-t py-8 text-center text-xs text-gray-500">
  	  © {new Date().getFullYear()} DrSoft
	</footer>
      </body>
    </html>
  );
}
