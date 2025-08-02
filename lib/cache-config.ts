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
  
  // Fetch com configuração anti-cache
  fetchWithNoCache: (url: string, options: RequestInit = {}) => {
    const bustingUrl = CACHE_CONFIG.addCacheBusting(url)
    return fetch(bustingUrl, {
      ...options,
      cache: 'no-store',
      headers: {
        ...CACHE_CONFIG.NO_CACHE_HEADERS,
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
    INVENTORY_UPDATED: 'inventory-updated',
    DATA_REFRESH_NEEDED: 'data-refresh-needed'
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
    
    // Also listen for custom events
    const handleCustomEvent = (e: CustomEvent) => {
      console.log(`Data updated via custom event: ${e.type}, refreshing...`)
      refreshFunction()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dataUpdated', handleCustomEvent as EventListener)
    
    return () => {
      clearInterval(refreshInterval)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('dataUpdated', handleCustomEvent as EventListener)
    }
  }
}

// Função para disparar evento de atualização melhorada
export const triggerDataUpdate = (eventType: keyof typeof CACHE_CONFIG.STORAGE_EVENTS) => {
  const event = CACHE_CONFIG.STORAGE_EVENTS[eventType]
  
  // Dispara evento de storage para tabs/windows diferentes
  localStorage.setItem(event, Date.now().toString())
  setTimeout(() => localStorage.removeItem(event), 100)
  
  // Dispara evento customizado para a mesma página
  window.dispatchEvent(new CustomEvent('dataUpdated', {
    detail: { eventType, timestamp: Date.now() }
  }))
  
  console.log(`Triggered data update event: ${eventType}`)
}

// Função para forçar refresh completo de todas as páginas
export const forcePageRefresh = () => {
  // Notifica todas as páginas para recarregar
  triggerDataUpdate('DATA_REFRESH_NEEDED')
  
  // Força reload da página atual após um pequeno delay
  setTimeout(() => {
    window.location.reload()
  }, 500)
}