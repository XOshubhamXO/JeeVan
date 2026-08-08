#!/usr/bin/env bash
set -e
echo "🌱 JeeVan — E2E Tests"
npx playwright test --reporter=list
