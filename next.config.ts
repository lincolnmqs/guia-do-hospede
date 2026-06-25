import type { NextConfig } from "next";

const remotePatterns: NextConfig["images"]["remotePatterns"] = [
  { protocol: "https", hostname: "images.unsplash.com" },
];

if (process.env.MINIO_ENDPOINT) {
  const { protocol, hostname } = new URL(process.env.MINIO_ENDPOINT);
  remotePatterns.push({
    protocol: protocol.replace(":", "") as "https" | "http",
    hostname,
  });
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: { remotePatterns },
};

export default nextConfig;
