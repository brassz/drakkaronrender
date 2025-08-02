"use client"

import { useState, useEffect } from "react"

interface DataRefreshIndicatorProps {
  isLoading?: boolean
  lastUpdate?: Date | null
  className?: string
}

export function DataRefreshIndicator({ 
  isLoading = false, 
  lastUpdate = null, 
  className = "" 
}: DataRefreshIndicatorProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getTimeAgo = (date: Date | null): string => {
    if (!date) return "Nunca"
    
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    
    if (diffSeconds < 60) {
      return `${diffSeconds}s atrás`
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m atrás`
    } else {
      const diffHours = Math.floor(diffMinutes / 60)
      return `${diffHours}h atrás`
    }
  }

  return (
    <div className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
      <span>
        {isLoading ? 'Atualizando dados...' : `Última atualização: ${getTimeAgo(lastUpdate)}`}
      </span>
    </div>
  )
}