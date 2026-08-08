#!/usr/bin/env bash
set -e
echo "🌱 JeeVan — Clean"
rm -rf .next node_modules
rm -f vercel-deploy-fix.zip vercel-auth-fix.zip jeevan-100-percent.zip
rm -f public/favicon.svg
rm -rf src/i18n src/app/api/admin/debug
find . -name ".DS_Store" -delete 2>/dev/null
echo "✅ Cleaned"
