import type { NextConfig } from "next";

// ShaderGradient's 3D light presets fetch HDR environment maps from this host.
const SHADERGRADIENT_ASSETS = "https://ruucm.github.io";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${SHADERGRADIENT_ASSETS}`,
  "font-src 'self'",
  `connect-src 'self' blob: data: ${SHADERGRADIENT_ASSETS}`,
  "worker-src 'self' blob:",
  // 'self' (not 'none') so the embedded /resume.pdf <object> keeps working
  "object-src 'self'",
  // 'self' for the /resume.pdf viewer; archive.org for the /doom emulator
  // embed; youtube-nocookie for the /about-me video
  "frame-src 'self' https://archive.org https://*.archive.org https://www.youtube-nocookie.com",
  "base-uri 'self'",
  "form-action 'self'",
  // 'self' (not 'none') so the site can embed its own /resume.pdf viewer
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Override Vercel's CDN default of "*" on static output
  { key: "Access-Control-Allow-Origin", value: "https://www.niketgupta.com" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@shadergradient/react", "three", "@react-three/fiber"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
