import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tokxv8ehtdjc1lpj.public.blob.vercel-storage.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        search: "",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
