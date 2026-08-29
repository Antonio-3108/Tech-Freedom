import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@tetherto/wdk-wallet-spark",
    "sodium-native",
  ],
};

export default nextConfig;