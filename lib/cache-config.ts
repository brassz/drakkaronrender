// Configurações centralizadas para controle de cache em tempo real
export const CACHE_CONFIG = {
  // Headers para eliminar completamente o cache
  NO_CACHE_HEADERS: {
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${Date.now()}"`,
    'Vary': '*',
    'X-No-Cache': 'true',
    'Clear-Site-Data': '"cache", "cookies", "storage"'
  },
  
  // Parâmetros para cache busting
  getCacheBustingParams: () => ({
    _t: Date.now(),
    _v: Math.random().toString(36).substring(7),
    _r: Math.random(),
    _bust: new Date().getTime()
  }),
  
  // URL com cache busting
  addCacheBusting: (url: string) => {
    const params = CACHE_CONFIG.getCacheBustingParams()
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}_t=${params._t}&_v=${params._v}&_r=${params._r}&_bust=${params._bust}`
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
    FORCE_REFRESH: 'force-refresh'
  },

  // Limpar todos os caches possíveis
  clearAllCaches: () => {
    // Limpar localStorage
    try {
      const lang = localStorage.getItem("selectedLang")
      localStorage.clear()
      if (lang) localStorage.setItem("selectedLang", lang)
    } catch (e) {
      console.warn('Could not clear localStorage:', e)
    }

    // Limpar sessionStorage
    try {
      sessionStorage.clear()
    } catch (e) {
      console.warn('Could not clear sessionStorage:', e)
    }

    // Disparar evento de atualização forçada
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new StorageEvent('storage', {
        key: CACHE_CONFIG.STORAGE_EVENTS.FORCE_REFRESH,
        newValue: Date.now().toString()
      }))
    }
  }
}

// Hook personalizado para auto-refresh
export const useAutoRefresh = (refreshFunction: () => void, interval: number = 15000) => {
  return () => {
    const refreshInterval = setInterval(refreshFunction, interval)
    
    const handleStorageChange = (e: StorageEvent) => {
      if (Object.values(CACHE_CONFIG.STORAGE_EVENTS).includes(e.key as string)) {
        console.log(`Data updated via storage event: ${e.key}, refreshing...`)
        refreshFunction()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing data...')
        refreshFunction()
      }
    }

    const handleFocus = () => {
      console.log('Window focused, refreshing data...')
      refreshFunction()
    }
    
    window.addEventListener('storage', handleStorageChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(refreshInterval)
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }
}

// Função para disparar evento de atualização
export const triggerDataUpdate = (eventType: keyof typeof CACHE_CONFIG.STORAGE_EVENTS) => {
  const event = CACHE_CONFIG.STORAGE_EVENTS[eventType]
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new StorageEvent('storage', {
      key: event,
      newValue: Date.now().toString()
    }))
  }
}