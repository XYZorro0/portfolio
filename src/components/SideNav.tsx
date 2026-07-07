"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, Clapperboard, Mail } from "lucide-react";

const sectionLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Resume", href: "/#resume" },
];

const pageLinks = [
  { label: "Play DOOM", href: "/doom", icon: Gamepad2 },
  { label: "About Me", href: "/about-me", icon: Clapperboard },
];

export default function SideNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop: fixed left rail ───────────────────────────── */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 z-50 flex-col bg-[#0d0d0d]/95 backdrop-blur-xl border-r border-red-500/15"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-6 h-16 border-b border-red-500/10 shrink-0"
        >
          <span className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center text-white text-xs font-mono font-bold">
            NG
          </span>
          <span className="text-sm font-semibold text-white tracking-tight">
            Niket Gupta
          </span>
        </Link>

        {/* Section links (home) */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              Portfolio
            </div>
            <div className="flex flex-col gap-0.5">
              {sectionLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-red-500/10 transition-all duration-200"
                >
                  <span className="text-[10px] font-mono text-red-500/70 group-hover:text-red-400 transition-colors">
                    0{i + 1}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              Extras
            </div>
            <div className="flex flex-col gap-0.5">
              {pageLinks.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "text-red-300 bg-red-500/15 border border-red-500/25"
                        : "text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={active ? "text-red-400" : "text-gray-600"}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Contact pinned at bottom */}
        <div className="px-3 pb-5 shrink-0">
          <a
            href="mailto:niketgupta1@gmail.com"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 hover:border-red-400 transition-all duration-200"
          >
            <Mail size={14} />
            Contact
          </a>
        </div>
      </motion.aside>

      {/* ── Mobile: top bar + drawer ───────────────────────────── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden fixed top-0 inset-x-0 z-50 nav-glass"
      >
        <div className="h-14 px-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-[10px] font-mono font-bold">
              NG
            </span>
            <span className="text-sm font-semibold text-white">Niket Gupta</span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="nav-glass border-t border-red-500/10 overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {sectionLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-gray-300 hover:text-white transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="h-px bg-red-500/10 my-2" />
                {pageLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 text-sm py-2 transition-colors ${
                      pathname === href
                        ? "text-red-300"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Icon size={15} className="text-red-500/80" />
                    {label}
                  </Link>
                ))}
                <a
                  href="mailto:niketgupta1@gmail.com"
                  className="text-sm text-red-400 hover:text-red-300 transition-colors py-2"
                >
                  Contact
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
