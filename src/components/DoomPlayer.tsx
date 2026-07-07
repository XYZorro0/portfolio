"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Maximize, RotateCcw } from "lucide-react";
import { DOOM_EMBED_URL } from "@/config/site";

export default function DoomPlayer() {
  const [started, setStarted] = useState(false);
  // Bumping the key remounts the iframe — effectively a console reset.
  const [runKey, setRunKey] = useState(0);

  return (
    // Width is capped by viewport height so the 16:9 frame fills the screen
    // vertically on desktop without pushing the header/controls out of view.
    <div className="space-y-4 mx-auto w-full md:max-w-[calc((100vh_-_16rem)*16/9)]">
      <div className="rounded-2xl border border-red-500/20 overflow-hidden glow-card bg-black">
        {started ? (
          <iframe
            key={runKey}
            src={DOOM_EMBED_URL}
            className="w-full aspect-video block"
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
            title="DOOM (1993 shareware) running in the browser via Em-DOSBox"
          />
        ) : (
          <button
            onClick={() => setStarted(true)}
            className="relative w-full aspect-video flex flex-col items-center justify-center gap-6 group cursor-pointer"
            aria-label="Start DOOM"
          >
            {/* Hellish backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 65%, rgba(206,17,65,0.4), transparent 65%), radial-gradient(ellipse 45% 35% at 50% 100%, rgba(255,120,30,0.25), transparent 70%), #050505",
              }}
            />
            <div className="relative flex flex-col items-center gap-2">
              <span
                className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #ffd9a0 0%, #ff9d3f 30%, #ce1141 70%, #6b0820 100%)",
                }}
              >
                DOOM
              </span>
              <span className="text-[11px] font-mono text-red-300/80 tracking-[0.3em] uppercase">
                Shareware · Episode 1 · Knee-Deep in the Dead
              </span>
            </div>

            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-red-600 group-hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-500/30 transition-colors duration-200"
            >
              <Play size={16} fill="currentColor" />
              Click to Play
            </motion.span>

            <span className="relative text-[11px] font-mono text-gray-500">
              ~3 MB · loads only when you press play
            </span>
          </button>
        )}
      </div>

      {/* Controls + reset */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="text-xs text-gray-500 space-y-1.5">
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono">
            <span><kbd className="text-red-400">↑↓←→</kbd> move</span>
            <span><kbd className="text-red-400">Ctrl</kbd> fire</span>
            <span><kbd className="text-red-400">Space</kbd> open doors</span>
            <span><kbd className="text-red-400">Shift</kbd> run</span>
            <span><kbd className="text-red-400">1–7</kbd> weapons</span>
            <span><kbd className="text-red-400">Esc</kbd> menu</span>
          </div>
          <p className="max-w-xl leading-relaxed">
            Click inside the game first so it captures your keyboard. Use the
            fullscreen control (<Maximize size={10} className="inline" />) inside
            the player for the real experience.
          </p>
        </div>
        {started && (
          <button
            onClick={() => setRunKey((k) => k + 1)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all duration-200"
          >
            <RotateCcw size={12} />
            Reset game
          </button>
        )}
      </div>

      {/* Legal / tech note */}
      <p className="text-[11px] text-gray-600 leading-relaxed max-w-2xl">
        This is the original 1993 DOOM shareware episode (DOOM1.WAD), which id
        Software released for free redistribution. It runs entirely in your
        browser via Em-DOSBox (open-source DOSBox compiled to WebAssembly),
        streamed from the Internet Archive&apos;s software library.
      </p>
    </div>
  );
}
