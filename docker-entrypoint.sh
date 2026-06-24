#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Running seed..."
npx tsx prisma/seed.ts

echo "Starting Next.js app..."
exec node server.js
