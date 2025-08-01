"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function RealtimeMonitor() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  
  useEffect(() => {
    if (!isVisible) return
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Função para contar registros
    const updateCounts = async () => {
      const tables = [
        'engine_packages',
        'hull_colors',
        'upholstery_packages',
        'additional_options',
        'boat_models',
        'dealers',
        'orders'
      ]
      
      const newCounts: Record<string, number> = {}
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (!error && count !== null) {
          newCounts[table] = count
        }
      }
      
      setCounts(newCounts)
    }
    
    // Atualizar contagens inicialmente
    updateCounts()
    
    // Configurar listeners para mudanças
    const channels: any[] = []
    
    const tables = [
      'engine_packages',
      'hull_colors',
      'upholstery_packages',
      'additional_options',
      'boat_models',
      'dealers',
      'orders'
    ]
    
    tables.forEach(table => {
      const channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => {
            const event = {
              table,
              event: payload.eventType,
              timestamp: new Date().toISOString(),
              data: payload.new || payload.old
            }
            
            setEvents(prev => [event, ...prev].slice(0, 10))
            updateCounts()
          }
        )
        .subscribe()
      
      channels.push(channel)
    })
    
    // Atualizar contagens a cada 5 segundos
    const interval = setInterval(updateCounts, 5000)
    
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel)
      })
      clearInterval(interval)
    }
  }, [isVisible])
  
  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50"
        variant="outline"
        size="sm"
      >
        📊 Monitor
      </Button>
    )
  }
  
  return (
    <Card className="fixed bottom-4 left-4 z-50 w-96 max-h-[600px] overflow-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Monitor em Tempo Real</span>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
          >
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Contagem de Registros:</h3>
          <div className="space-y-1 text-sm">
            {Object.entries(counts).map(([table, count]) => (
              <div key={table} className="flex justify-between">
                <span className="text-gray-600">{table}:</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Eventos Recentes:</h3>
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum evento ainda...</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="text-xs border rounded p-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{event.table}</span>
                    <span className={`px-2 py-1 rounded text-white ${
                      event.event === 'INSERT' ? 'bg-green-500' :
                      event.event === 'UPDATE' ? 'bg-blue-500' :
                      event.event === 'DELETE' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}>
                      {event.event}
                    </span>
                  </div>
                  <div className="text-gray-500 mt-1">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  {event.data?.name && (
                    <div className="mt-1 text-gray-700">
                      {event.data.name}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <Button
          onClick={() => window.location.reload()}
          size="sm"
          variant="outline"
          className="w-full"
        >
          🔄 Recarregar Página
        </Button>
      </CardContent>
    </Card>
  )
}