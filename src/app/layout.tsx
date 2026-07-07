import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.niketgupta.com"),
  alternates: {
    canonical: "/",
  },
  title: "Niket Gupta — AI/ML Engineer & Full-Stack Developer",
  description:
    "Portfolio of Niket Gupta — AI/ML Engineer and Full-Stack Developer specializing in PyTorch, LLMs, React, and cloud-native systems.",
  keywords: [
    "Niket Gupta",
    "AI Engineer",
    "ML Engineer",
    "Full-Stack Developer",
    "PyTorch",
    "React",
    "Next.js",
    "Python",
  ],
  authors: [{ name: "Niket Gupta" }],
  openGraph: {
    title: "Niket Gupta — AI/ML Engineer & Full-Stack Developer",
    description:
      "Portfolio of Niket Gupta — AI/ML Engineer and Full-Stack Developer.",
    type: "website",
    url: "https://www.niketgupta.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niket Gupta — AI/ML Engineer & Full-Stack Developer",
    description:
      "Portfolio of Niket Gupta — AI/ML Engineer and Full-Stack Developer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f4f4f5]">
        <div className="noise-overlay" />
        <SideNav />
        {/* Offset for the fixed side rail (desktop) / top bar (mobile) */}
        <div className="flex-1 flex flex-col pt-14 md:pt-0 md:pl-56">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
