/**
 * One-shot bootstrap: uploads the reference property photos to the MinIO
 * bucket and prints the resulting public URLs.
 *
 * The object keys are deterministic (`properties/<CODE>/<n>.jpg`), so the
 * public URLs are stable and are baked directly into `prisma/seed.ts`. Re-runs
 * are idempotent (objects are overwritten in place).
 *
 *   npm run images:upload
 */
import {
  readMinioConfig,
  createMinioClient,
  ensurePublicBucket,
  uploadObject,
  publicUrl,
} from "../lib/storage/minio";

if (!process.env.MINIO_ENDPOINT) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // fall through — readMinioConfig throws a clear error if still unset
  }
}

// Source photos (the same Unsplash references used before) per property.
const SOURCES: Record<string, string[]> = {
  FLN001: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200",
  ],
  GRM001: [
    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200",
    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
  ],
};

async function main() {
  const config = readMinioConfig();
  const client = createMinioClient(config);

  await ensurePublicBucket(client, config.bucket);
  console.log(`Bucket pronto (público para leitura): ${config.bucket}`);

  const result: Record<string, string[]> = {};

  for (const [code, urls] of Object.entries(SOURCES)) {
    result[code] = [];
    for (let i = 0; i < urls.length; i++) {
      const res = await fetch(urls[i]);
      if (!res.ok) throw new Error(`Falha ao baixar ${urls[i]} (${res.status})`);
      const contentType = res.headers.get("content-type") ?? "image/jpeg";
      const buffer = Buffer.from(await res.arrayBuffer());

      const key = `properties/${code}/${i + 1}.jpg`;
      await uploadObject(client, config.bucket, key, buffer, contentType);

      const url = publicUrl(config, key);
      result[code].push(url);
      console.log(`  ✓ ${code} #${i + 1} → ${url}`);
    }
  }

  console.log("\n=== URLs públicas (cole em prisma/seed.ts) ===");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
