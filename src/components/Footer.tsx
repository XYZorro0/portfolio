"use client";

import { GitFork, Link2, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-indigo-500/10 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="text-sm font-mono font-semibold text-indigo-400 mb-1">
            Niket Gupta
          </div>
          <div className="text-xs text-gray-600">
            AI/ML Engineer & Full-Stack Developer
          </div>
        </div>

        <div className="flex items-center gap-5">
          {[
            { href: "https://github.com/xyzorro0", icon: GitFork, label: "GitHub" },
            { href: "https://linkedin.com/in/niketgupta", icon: Link2, label: "LinkedIn" },
            { href: "mailto:niketgupta1@gmail.com", icon: Mail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-600 hover:text-indigo-400 transition-colors duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <div className="text-xs text-gray-700 font-mono">
          niketgupta.com
        </div>
      </div>
    </footer>
  );
}
