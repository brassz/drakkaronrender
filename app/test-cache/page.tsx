"use client"

import { CacheDiagnostic } from "@/components/cache-diagnostic"
import { DataPersistenceMonitor } from "@/components/data-persistence-monitor"
import Link from "next/link"

export default function TestCachePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Cache & Data Sync Diagnostic</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <CacheDiagnostic 
            endpoint="/api/get-admin-data" 
            title="Admin Data API"
          />
          
          <CacheDiagnostic 
            endpoint="/api/get-dealer-config" 
            title="Dealer Config API"
          />
        </div>
        
        <DataPersistenceMonitor />
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">Troubleshooting Steps:</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Check if data is updating in the APIs above when you save in Administrator</li>
            <li>Use the "Clear Cache" button to force cache invalidation</li>
            <li>Check the Data Persistence Monitor to see if database is being updated</li>
            <li>Try refreshing the page with Ctrl+F5 (hard refresh)</li>
            <li>Check browser DevTools Network tab for cached responses</li>
          </ol>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Common Issues:</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li><strong>CDN Caching:</strong> If using a CDN, it might be caching API responses</li>
            <li><strong>Browser Cache:</strong> Browser might be caching despite no-cache headers</li>
            <li><strong>Service Worker:</strong> Check if a service worker is intercepting requests</li>
            <li><strong>Next.js Cache:</strong> Next.js might be caching at build time</li>
          </ul>
        </div>
      </div>
    </div>
  )
}