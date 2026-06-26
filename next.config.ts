import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@shadergradient/react", "three", "@react-three/fiber"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
