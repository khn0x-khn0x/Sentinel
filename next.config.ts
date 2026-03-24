import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Toto povie Next.js, aby ignoroval chyby pri type checkingu počas buildu
    ignoreBuildErrors: true,
  },
  eslint: {
    // Toto ignoruje chyby ESLintu počas buildu (pre istotu)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
