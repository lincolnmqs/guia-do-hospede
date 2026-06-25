import type { NextConfig } from "next";

const minioPattern = process.env.MINIO_ENDPOINT
  ? (() => {
      const { protocol, hostname } = new URL(process.env.MINIO_ENDPOINT!);
      return [{ protocol: protocol.replace(":", "") as "https" | "http", hostname }];
    })()
  : [];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...minioPattern,
    ],
  },
};

export default nextConfig;
