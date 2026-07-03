"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import { GitHubIcon, LinkedInIcon } from "./ui/BrandIcons";

const ShaderGradientCanvas = dynamic(
  () =>
    import("@shadergradient/react").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false }
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradient),
  { ssr: false }
);

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ShaderGradient background */}
      <div className="absolute inset-0 z-0">
        {/* Static fallback so the first paint isn't a black screen while WebGL loads */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(206,17,65,0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(122,10,38,0.3), transparent 65%), #0a0a0a",
          }}
        />
        <ShaderGradientCanvas
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          pointerEvents="none"
        >
          <ShaderGradient
            type="waterPlane"
            animate="on"
            uSpeed={0.35}
            uStrength={2.5}
            uDensity={1.2}
            uFrequency={5.5}
            uAmplitude={4.0}
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={45}
            rotationY={0}
            rotationZ={0}
            color1="#ce1141"
            color2="#0a0a0a"
            color3="#7a0a26"
            lightType="3d"
            envPreset="lobby"
            reflection={0.3}
            cAzimuthAngle={180}
            cPolarAngle={75}
            cDistance={2.5}
            cameraZoom={1}
            uTime={0}
          />
        </ShaderGradientCanvas>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/20 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-mono tracking-widest uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available for opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-none"
        >
          <span className="text-white">Niket</span>
          <br />
          <span className="gradient-text">Gupta</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed"
        >
          AI/ML Engineer & Full-Stack Developer building intelligent systems
          that scale — from model training to production deployment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap gap-4 justify-center mt-2"
        >
          <a
            href="#resume"
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5"
          >
            View Resume
          </a>
          <a
            href="#projects"
            className="px-6 py-3 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 hover:border-red-400 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            See My Work
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-5 mt-2"
        >
          {[
            {
              href: "https://github.com/xyzorro0",
              icon: <GitHubIcon size={18} />,
              label: "GitHub",
            },
            {
              href: "https://www.linkedin.com/in/niketgupta1/",
              icon: <LinkedInIcon size={18} />,
              label: "LinkedIn",
            },
            {
              href: "mailto:niketgupta1@gmail.com",
              icon: <Mail size={18} />,
              label: "Email",
            },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-500 hover:text-red-400 transition-colors duration-200"
            >
              {icon}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-gray-600"
        >
          <ArrowDown size={16} />
        </motion.div>
        <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
