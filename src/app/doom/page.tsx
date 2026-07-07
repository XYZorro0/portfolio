import type { Metadata } from "next";
import DoomPlayer from "@/components/DoomPlayer";

export const metadata: Metadata = {
  title: "Play DOOM — Niket Gupta",
  description:
    "Play the original 1993 DOOM shareware episode right in your browser — my litmus test for whether a browser or AI model can run real software.",
  alternates: { canonical: "/doom" },
};

export default function DoomPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="my-auto w-full max-w-6xl mx-auto px-6 pt-20 md:pt-10 pb-12">
        <div className="text-center mb-6">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase">
            Extras · Play DOOM
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            Rip and tear — <span className="gradient-text">in the browser</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
            What I love about this version of DOOM is that it can be played on
            almost any device — even an old calculator. I keep it in my browser
            as a litmus test: whenever I&apos;m working with a new browser or an
            AI model, I check whether it can run this application. If it
            can&apos;t, I try to improve it until it can.
          </p>
        </div>

        <DoomPlayer />
      </div>
    </main>
  );
}
