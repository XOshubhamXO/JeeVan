#!/usr/bin/env node
/**
 * JeeVan PWA Icon Generator
 * Creates icon-192.png and icon-512.png using raw pixel data
 */
const fs = require('fs');
const path = require('path');

// Minimal PNG encoder
function createPNG(size, fill) {
  // Create a minimal valid PNG with a solid color fill
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Dark green background
  ctx.fillStyle = '#0a1508';
  ctx.fillRect(0, 0, size, size);
  
  // Green gradient circle
  const gradient = ctx.createRadialGradient(size*0.5, size*0.4, size*0.05, size*0.5, size*0.5, size*0.48);
  gradient.addColorStop(0, '#3d8b37');
  gradient.addColorStop(0.7, '#0a2a08');
  gradient.addColorStop(1, '#0a1508');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size*0.5, size*0.5, size*0.46, 0, Math.PI*2);
  ctx.fill();
  
  // "J" letter in the center
  ctx.fillStyle = '#7bc67e';
  ctx.font = `bold ${size*0.5}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('J', size*0.5, size*0.5);
  
  // Small leaf accent
  ctx.fillStyle = '#5cb85c';
  ctx.beginPath();
  ctx.ellipse(size*0.68, size*0.32, size*0.08, size*0.04, 0.5, 0, Math.PI*2);
  ctx.fill();
  
  return canvas.toBuffer('image/png');
}

async function main() {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
  
  const icon192 = createPNG(192);
  const icon512 = createPNG(512);
  
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
  
  console.log('✅ Generated icon-192.png and icon-512.png');
}

try {
  main();
} catch (e) {
  console.log('⚠️ Canvas module not available. Install with: npm install canvas');
  console.log('Alternative: use https://realfavicongenerator.net to generate icons');
}
