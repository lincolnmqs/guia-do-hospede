import * as Minio from "minio";

// ---------------------------------------------------------------------------
// MinIO (S3-compatible) client for property images.
//
// Images are served as stable public URLs persisted in the database, so the
// app itself never needs this module at request time — only the upload script
// (`scripts/seed-images.ts`) does. Construction is therefore lazy and throws a
// clear error if the env is incomplete, instead of crashing app boot.
// ---------------------------------------------------------------------------

export interface MinioConfig {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
}

export function readMinioConfig(): MinioConfig {
  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  const bucket = process.env.MINIO_BUCKET ?? "guia-do-hospede";

  if (!endpoint || !accessKey || !secretKey) {
    throw new Error(
      "MinIO não configurado: defina MINIO_ENDPOINT, MINIO_ACCESS_KEY e MINIO_SECRET_KEY no .env",
    );
  }
  return { endpoint, accessKey, secretKey, bucket };
}

/** Splits "https://host:port" into the fields the MinIO client expects. */
function parseEndpoint(endpoint: string): {
  endPoint: string;
  port: number;
  useSSL: boolean;
} {
  const url = new URL(endpoint);
  const useSSL = url.protocol === "https:";
  const port = url.port ? Number(url.port) : useSSL ? 443 : 80;
  return { endPoint: url.hostname, port, useSSL };
}

export function createMinioClient(config: MinioConfig): Minio.Client {
  const { endPoint, port, useSSL } = parseEndpoint(config.endpoint);
  return new Minio.Client({
    endPoint,
    port,
    useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  });
}

/** Anonymous read-only policy so objects are publicly fetchable by <img>/next/image. */
function publicReadPolicy(bucket: string): string {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });
}

/** Creates the bucket if missing and ensures anonymous read access. Idempotent. */
export async function ensurePublicBucket(
  client: Minio.Client,
  bucket: string,
): Promise<void> {
  const exists = await client.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(bucket);
  }
  await client.setBucketPolicy(bucket, publicReadPolicy(bucket));
}

export async function uploadObject(
  client: Minio.Client,
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await client.putObject(bucket, key, body, body.length, {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
  });
}

/** Stable public URL for an object: `${endpoint}/${bucket}/${key}`. */
export function publicUrl(config: MinioConfig, key: string): string {
  const base = config.endpoint.replace(/\/$/, "");
  return `${base}/${config.bucket}/${key}`;
}
