"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Download, FileText } from "lucide-react";

export default function ResumeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="resume" className="section max-w-6xl mx-auto px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase">
            04. Resume
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
          >
            <Download size={12} />
            Download PDF
          </a>
        </div>

        {/* PDF viewer */}
        <div className="rounded-2xl border border-red-500/15 overflow-hidden glow-card bg-[#141414]">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-red-500/10 bg-[#0f0f0f]">
            <div className="flex items-center gap-2 text-gray-400">
              <FileText size={14} />
              <span className="text-xs font-mono">Niket_Gupta_Resume.pdf</span>
            </div>
            <a
              href="/resume.pdf"
              download
              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Download size={11} />
              Save
            </a>
          </div>

          {/* Embedded PDF */}
          <div className="relative w-full" style={{ height: "800px" }}>
            <object
              data="/resume.pdf"
              type="application/pdf"
              className="absolute inset-0 w-full h-full"
              aria-label="Niket Gupta Resume"
            >
              {/* Fallback when PDF can't be embedded */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <FileText size={28} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Resume Available for Download
                  </h3>
                  <p className="text-sm text-gray-400 max-w-sm mb-6">
                    Your browser may not support inline PDF viewing. Download
                    the PDF directly to view Niket&apos;s full resume.
                  </p>
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-red-500/20"
                  >
                    <Download size={15} />
                    Download Resume
                  </a>
                </div>
              </div>
            </object>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
