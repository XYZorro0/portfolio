import type { Metadata } from "next";
import DoomPlayer from "@/components/DoomPlayer";

export const metadata: Metadata = {
  title: "Play DOOM — Niket Gupta",
  description:
    "Play the original 1993 DOOM shareware episode right in your browser, hosted on Niket Gupta's portfolio.",
  alternates: { canonical: "/doom" },
};

export default function DoomPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-24 md:pt-16 pb-20">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase">
            Extras · Play DOOM
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Rip and tear — <span className="gradient-text">in the browser</span>
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mb-10">
          Before neural networks, this is what pushed hardware to its limits.
          The original 1993 shareware DOOM, running on a DOS emulator compiled
          to WebAssembly. No install, no plugins — just click play.
        </p>

        <DoomPlayer />
      </div>
    </main>
  );
}
