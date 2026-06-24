import type { NextConfig } from "next";

// Host of the MinIO/object-storage endpoint that serves property images.
// Derived from MINIO_ENDPOINT so a different deployment only sets the env var.
const minioHost = (() => {
  try {
    return new URL(
      process.env.MINIO_ENDPOINT ?? "https://minio.qvr35i.easypanel.host",
    ).hostname;
  } catch {
    return "minio.qvr35i.easypanel.host";
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: minioHost },
      // Kept as a fallback for any legacy/reference image still using Unsplash.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
