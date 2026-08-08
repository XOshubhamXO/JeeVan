#!/usr/bin/env bash
set -e
echo "🌱 JeeVan — Deploy"
rm -rf .next
npx next build
git add -A
NOW=$(date +"%Y-%m-%d %H:%M")
git commit -m "Deploy: $NOW" || echo "Nothing to commit"
git push -u origin main
echo "✅ Pushed — Vercel auto-deploys"
