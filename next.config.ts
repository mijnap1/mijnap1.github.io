import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages. `trailingSlash` keeps the existing
  // `/aboutme/` style URLs by emitting `aboutme/index.html`.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
