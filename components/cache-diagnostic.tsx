"use client"

import { useState, useEffect } from "react"

interface CacheDiagnosticProps {
  endpoint: string
  title: string
}

export function CacheDiagnostic({ endpoint, title }: CacheDiagnosticProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const timestamp = Date.now()
      const response = await fetch(`${endpoint}?_t=${timestamp}&_nocache=true`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      setData(result)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000)
    
    return () => clearInterval(interval)
  }, [endpoint])

  const clearCache = async () => {
    try {
      const response = await fetch('/api/debug-cache', {
        method: 'POST',
        cache: 'no-store',
      })
      
      if (response.ok) {
        alert('Cache cleared! Refreshing data...')
        fetchData()
      }
    } catch (err) {
      console.error('Failed to clear cache:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={clearCache}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Clear Cache
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">
          Error: {error}
        </div>
      )}
      
      {lastUpdate && (
        <div className="text-sm text-gray-600 mb-2">
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
      
      {data && (
        <div className="bg-gray-50 rounded p-2 text-xs font-mono overflow-auto max-h-40">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}