// Utility functions for fetching data without cache

export interface FetchOptions extends RequestInit {
  revalidate?: number | false
}

/**
 * Fetch data with aggressive no-cache settings
 */
export async function fetchNoCache(url: string, options: FetchOptions = {}) {
  // Add timestamp to URL to bust cache
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(7)
  const separator = url.includes('?') ? '&' : '?'
  const bustUrl = `${url}${separator}_t=${timestamp}&_r=${randomId}`
  
  // Merge options with no-cache defaults
  const fetchOptions: RequestInit = {
    ...options,
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-No-Cache': '1',
      'X-Timestamp': timestamp.toString(),
      ...options.headers,
    },
  }
  
  return fetch(bustUrl, fetchOptions)
}

/**
 * Force browser to reload all resources
 */
export function forceReload() {
  // Clear service worker cache if exists
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister()
      })
    })
  }
  
  // Clear caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name)
      })
    })
  }
  
  // Hard reload
  window.location.reload()
}

/**
 * Emit storage event to sync across tabs
 */
export function emitDataUpdateEvent(eventType: string) {
  // Use localStorage to trigger storage event
  localStorage.setItem(`data-update-${eventType}`, Date.now().toString())
  
  // Also dispatch custom event for same tab
  window.dispatchEvent(new CustomEvent('data-updated', {
    detail: { type: eventType, timestamp: Date.now() }
  }))
}