import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The portfolio is intentionally static so the same build can run on
  // GitHub Pages now and on a domestic static host later.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
