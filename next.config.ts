import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    rules: {
      "*.wasm": {
        type: "asset",
      },
    },
  },
};

export default nextConfig;
