import { CACHE_CONFIG } from './cache-config'

// Types for sync events
export interface SyncEvent {
  type: 'data_updated' | 'order_created' | 'inventory_changed' | 'pricing_updated'
  table?: string
  timestamp: string
  data?: any
}

// Real-time sync manager
export class SyncManager {
  private static instance: SyncManager
  private eventListeners: Map<string, Function[]> = new Map()
  private syncInterval: NodeJS.Timeout | null = null
  private lastSyncTimestamp: string = new Date().toISOString()

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager()
    }
    return SyncManager.instance
  }

  // Subscribe to sync events
  subscribe(eventType: string, callback: Function): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    
    const listeners = this.eventListeners.get(eventType)!
    listeners.push(callback)

    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  // Emit sync event
  emit(event: SyncEvent): void {
    console.log('🔄 Sync event emitted:', event)
    
    const listeners = this.eventListeners.get(event.type) || []
    listeners.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('Error in sync event listener:', error)
      }
    })

    // Also emit to storage for cross-tab sync
    if (typeof window !== 'undefined') {
      localStorage.setItem('sync_event', JSON.stringify(event))
      window.dispatchEvent(new CustomEvent('sync_event', { detail: event }))
    }
  }

  // Start automatic sync check
  startAutoSync(intervalMs: number = 30000): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    this.syncInterval = setInterval(async () => {
      await this.checkForUpdates()
    }, intervalMs)

    // Listen for cross-tab sync events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'sync_event' && e.newValue) {
          try {
            const event: SyncEvent = JSON.parse(e.newValue)
            this.emit(event)
          } catch (error) {
            console.error('Error parsing sync event:', error)
          }
        }
      })
    }
  }

  // Stop automatic sync
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Check for updates from server
  private async checkForUpdates(): Promise<void> {
    try {
      const response = await CACHE_CONFIG.fetchWithNoCache('/api/get-admin-data')
      
      if (response.ok) {
        const data = await response.json()
        
        // Check if data has been updated since last sync
        const serverTimestamp = data.timestamp || new Date().toISOString()
        
        if (serverTimestamp > this.lastSyncTimestamp) {
          this.emit({
            type: 'data_updated',
            timestamp: serverTimestamp,
            data: data
          })
          
          this.lastSyncTimestamp = serverTimestamp
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }

  // Force refresh all data
  async forceRefresh(): Promise<void> {
    this.emit({
      type: 'data_updated',
      timestamp: new Date().toISOString()
    })
  }

  // Update display order with sync
  async updateDisplayOrder(table: string, items: any[]): Promise<boolean> {
    try {
      const response = await CACHE_CONFIG.fetchWithNoCache('/api/save-display-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: table, items })
      })

      if (response.ok) {
        this.emit({
          type: 'data_updated',
          table,
          timestamp: new Date().toISOString(),
          data: { action: 'display_order_updated', items }
        })
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error updating display order:', error)
      return false
    }
  }
}

// React hook for using sync manager
export function useSyncManager() {
  const syncManager = SyncManager.getInstance()

  return {
    subscribe: syncManager.subscribe.bind(syncManager),
    emit: syncManager.emit.bind(syncManager),
    startAutoSync: syncManager.startAutoSync.bind(syncManager),
    stopAutoSync: syncManager.stopAutoSync.bind(syncManager),
    forceRefresh: syncManager.forceRefresh.bind(syncManager),
    updateDisplayOrder: syncManager.updateDisplayOrder.bind(syncManager)
  }
}

// Utility functions for common sync operations
export const syncUtils = {
  // Trigger data refresh across all tabs
  triggerRefresh: (table?: string) => {
    SyncManager.getInstance().emit({
      type: 'data_updated',
      table,
      timestamp: new Date().toISOString()
    })
  },

  // Trigger pricing update notification
  triggerPricingUpdate: (data?: any) => {
    SyncManager.getInstance().emit({
      type: 'pricing_updated',
      timestamp: new Date().toISOString(),
      data
    })
  },

  // Trigger inventory change notification
  triggerInventoryChange: (data?: any) => {
    SyncManager.getInstance().emit({
      type: 'inventory_changed',
      timestamp: new Date().toISOString(),
      data
    })
  }
}