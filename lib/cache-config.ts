// Configurações centralizadas para controle de cache em tempo real
export const CACHE_CONFIG = {
  // Headers para eliminar completamente o cache
  NO_CACHE_HEADERS: {
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${Date.now()}"`
  },
  
  // Parâmetros para cache busting
  getCacheBustingParams: () => ({
    _t: Date.now(),
    _v: Math.random().toString(36).substring(7)
  }),
  
  // URL com cache busting
  addCacheBusting: (url: string) => {
    const params = CACHE_CONFIG.getCacheBustingParams()
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}_t=${params._t}&_v=${params._v}`
  },
  
  // Fetch com configuração anti-cache - Enhanced for Vercel
  fetchWithNoCache: (url: string, options: RequestInit = {}) => {
    const bustingUrl = CACHE_CONFIG.addCacheBusting(url)
    return fetch(bustingUrl, {
      ...options,
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation on every request for Vercel
      headers: {
        ...CACHE_CONFIG.NO_CACHE_HEADERS,
        'X-Vercel-Cache': 'MISS', // Force cache miss on Vercel
        'X-Vercel-Set-Cache-Headers': 'false',
        ...options.headers,
      },
    })
  },
  
  // Aplicar headers anti-cache em uma Response
  applyNoCacheHeaders: (response: Response) => {
    Object.entries(CACHE_CONFIG.NO_CACHE_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  },
  
  // Storage event para sincronização entre abas
  STORAGE_EVENTS: {
    ADMIN_DATA_UPDATED: 'admin-data-updated',
    ORDER_CREATED: 'order-created',
    INVENTORY_UPDATED: 'inventory-updated'
  }
}

// Hook personalizado para auto-refresh
export const useAutoRefresh = (refreshFunction: () => void, interval: number = 30000) => {
  return () => {
    const refreshInterval = setInterval(refreshFunction, interval)
    
    const handleStorageChange = (e: StorageEvent) => {
      if (Object.values(CACHE_CONFIG.STORAGE_EVENTS).includes(e.key as string)) {
        console.log(`Data updated via storage event: ${e.key}, refreshing...`)
        refreshFunction()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      clearInterval(refreshInterval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }
}

// Função para disparar evento de atualização
export const triggerDataUpdate = (eventType: keyof typeof CACHE_CONFIG.STORAGE_EVENTS) => {
  const event = CACHE_CONFIG.STORAGE_EVENTS[eventType]
  window.dispatchEvent(new StorageEvent('storage', {
    key: event,
    newValue: Date.now().toString()
  }))
}

// Function to force refresh on Vercel specifically
export const forceVercelRefresh = async () => {
  try {
    // Clear all possible caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
    
    // Force reload with no cache
    if (typeof window !== 'undefined') {
      // Force hard refresh to bypass all caches
      window.location.reload()
    }
  } catch (error) {
    console.warn('Failed to clear caches:', error)
  }
}