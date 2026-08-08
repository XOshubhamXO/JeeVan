#!/usr/bin/env bash
set -e
echo "🌱 JeeVan — Deploy"

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "📦 Installing dependencies..."
  npm install --legacy-peer-deps
fi

rm -rf .next
npm run build
git add -A
NOW=$(date +"%Y-%m-%d %H:%M")
git commit -m "Deploy: $NOW" || echo "Nothing to commit"
git push -u origin main
echo "✅ Pushed — Vercel auto-deploys"
