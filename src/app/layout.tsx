import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    url: "https://niketgupta.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niket Gupta — AI/ML Engineer & Full-Stack Developer",
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
      <body className="min-h-full flex flex-col bg-[#05050f] text-[#e8eaf6]">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
