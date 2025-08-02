#!/usr/bin/env node

/**
 * Script to clear cache after deployment on Render
 * This ensures fresh data is always served
 */

console.log('🧹 Clearing application cache...');

// If using any cache directories, clear them here
const fs = require('fs');
const path = require('path');

// Clear Next.js cache if it exists
const nextCacheDir = path.join(__dirname, '..', '.next', 'cache');
if (fs.existsSync(nextCacheDir)) {
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
  console.log('✅ Next.js cache cleared');
}

// Clear any other cache directories
const cacheDirectories = [
  '.cache',
  'node_modules/.cache',
  '.next/cache',
];

cacheDirectories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Cleared ${dir}`);
  }
});

console.log('🎉 Cache clearing complete!');