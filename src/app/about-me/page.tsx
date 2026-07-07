import type { Metadata } from "next";
import Link from "next/link";
import AboutVideo from "@/components/AboutVideo";

export const metadata: Metadata = {
  title: "About Me — Niket Gupta",
  description:
    "A video introduction to Niket Gupta — AI/ML Engineer and Full-Stack Developer.",
  alternates: { canonical: "/about-me" },
};

export default function AboutMePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-24 md:pt-16 pb-20">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase">
            Extras · About Me
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Meet me <span className="gradient-text">on camera</span>
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mb-10">
          A short video about who I am, how I got into AI/ML, and what
          I&apos;m building. Prefer reading? The{" "}
          <Link href="/#about" className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors">
            written version
          </Link>{" "}
          is on the home page.
        </p>

        <AboutVideo />
      </div>
    </main>
  );
}
