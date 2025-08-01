import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeDataOptions {
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  enabled?: boolean
}

export function useRealtimeData(
  table: string,
  options: UseRealtimeDataOptions = {}
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const { onInsert, onUpdate, onDelete, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    // Create a channel for the table
    const tableChannel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`New ${table} inserted:`, payload)
          onInsert?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`${table} updated:`, payload)
          onUpdate?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`${table} deleted:`, payload)
          onDelete?.(payload)
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status)
      })

    setChannel(tableChannel)

    // Cleanup on unmount
    return () => {
      if (tableChannel) {
        supabase.removeChannel(tableChannel)
      }
    }
  }, [table, enabled])

  return channel
}

// Hook para escutar mudanças em múltiplas tabelas
export function useRealtimeMultipleTables(
  tables: string[],
  onAnyChange: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || tables.length === 0) return

    const channels: RealtimeChannel[] = []

    tables.forEach((table) => {
      const channel = supabase
        .channel(`${table}_multi_changes`)
        .on(
          'postgres_changes',
          {
            event: '*', // Escuta todos os eventos
            schema: 'public',
            table: table,
          },
          (payload) => {
            console.log(`Change detected in ${table}:`, payload)
            onAnyChange()
          }
        )
        .subscribe()

      channels.push(channel)
    })

    // Cleanup on unmount
    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel)
      })
    }
  }, [tables.join(','), enabled])
}