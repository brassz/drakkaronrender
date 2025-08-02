#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Next.js cache...');

// Paths to clear
const cachePaths = [
  '.next/cache',
  '.next/server/app-paths-manifest.json',
  '.next/server/pages-manifest.json',
  '.next/server/middleware-manifest.json',
];

cachePaths.forEach(cachePath => {
  const fullPath = path.join(process.cwd(), cachePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Cleared directory: ${cachePath}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✅ Cleared file: ${cachePath}`);
      }
    } catch (error) {
      console.error(`❌ Error clearing ${cachePath}:`, error.message);
    }
  } else {
    console.log(`⏭️  Skipped (not found): ${cachePath}`);
  }
});

console.log('\n✨ Cache clearing complete!');
console.log('💡 Remember to restart your Next.js server for changes to take effect.');