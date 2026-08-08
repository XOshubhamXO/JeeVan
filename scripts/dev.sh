#!/usr/bin/env bash
echo "🌱 JeeVan — Dev Server"

# Kill anything already on port 3000
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 0.5

# Try ports 3000 → 3001 → 3002
PORT=3000
while lsof -ti:$PORT >/dev/null 2>&1; do
  PORT=$((PORT + 1))
  [ $PORT -gt 3002 ] && echo "Ports 3000-3002 are busy. Free one and retry." && exit 1
done

echo "→ http://localhost:$PORT"
npm run dev -- -p $PORT
