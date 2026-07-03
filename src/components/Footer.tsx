"use client";

import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "./ui/BrandIcons";

export default function Footer() {
  return (
    <footer className="border-t border-red-500/10 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="text-sm font-mono font-semibold text-red-400 mb-1">
            Niket Gupta
          </div>
          <div className="text-xs text-gray-600">
            AI/ML Engineer & Full-Stack Developer
          </div>
        </div>

        <div className="flex items-center gap-5">
          {[
            { href: "https://github.com/xyzorro0", icon: <GitHubIcon size={16} />, label: "GitHub" },
            { href: "https://www.linkedin.com/in/niketgupta1/", icon: <LinkedInIcon size={16} />, label: "LinkedIn" },
            { href: "mailto:niketgupta1@gmail.com", icon: <Mail size={16} />, label: "Email" },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-600 hover:text-red-400 transition-colors duration-200"
            >
              {icon}
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
