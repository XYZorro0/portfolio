"use client";

import { motion } from "framer-motion";
import { Clapperboard, Play } from "lucide-react";
import { ABOUT_VIDEO_ID } from "@/config/site";

export default function AboutVideo() {
  const isPlaceholder = ABOUT_VIDEO_ID === "PLACEHOLDER";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-red-500/20 overflow-hidden glow-card bg-[#141414]"
    >
      {isPlaceholder ? (
        /* Thumbnail-style "coming soon" state — swap ABOUT_VIDEO_ID in
           src/config/site.ts to replace this with the real embed. */
        <div className="relative w-full aspect-video flex flex-col items-center justify-center gap-5">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(206,17,65,0.18), transparent 65%), #101010",
            }}
          />
          <div className="relative w-16 h-16 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center">
            <Play size={24} className="text-red-400/70 translate-x-0.5" fill="currentColor" />
          </div>
          <div className="relative text-center px-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clapperboard size={14} className="text-red-400" />
              <span className="text-[11px] font-mono text-red-400 tracking-widest uppercase">
                Video coming soon
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              I&apos;m putting together a short video about who I am and what I
              build. Check back soon — or scroll through the portfolio in the
              meantime.
            </p>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ABOUT_VIDEO_ID}`}
          className="w-full aspect-video block"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="About Niket Gupta"
        />
      )}
    </motion.div>
  );
}
