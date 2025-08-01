"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Interceptar fetch para monitorar requisições
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const [url, options] = args
      const startTime = Date.now()
      
      try {
        const response = await originalFetch(...args)
        const duration = Date.now() - startTime
        
        // Log de requisições de salvamento
        if (typeof url === 'string' && url.includes('save')) {
          const clonedResponse = response.clone()
          const responseData = await clonedResponse.json().catch(() => null)
          
          setDebugInfo(prev => ({
            ...prev,
            lastSaveRequest: {
              url,
              method: options?.method || 'GET',
              status: response.status,
              duration: `${duration}ms`,
              timestamp: new Date().toISOString(),
              responseData,
              requestBody: options?.body ? JSON.parse(options.body as string) : null
            }
          }))
        }
        
        return response
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          lastError: {
            url,
            error: error.message,
            timestamp: new Date().toISOString()
          }
        }))
        throw error
      }
    }
    
    return () => {
      window.fetch = originalFetch
    }
  }, [])

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
        variant="outline"
        size="sm"
      >
        🐛 Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Debug Panel</span>
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
        {debugInfo.lastSaveRequest && (
          <div>
            <h3 className="font-semibold mb-2">Última Requisição de Salvamento:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.lastSaveRequest, null, 2)}
            </pre>
          </div>
        )}
        
        {debugInfo.lastError && (
          <div>
            <h3 className="font-semibold mb-2 text-red-600">Último Erro:</h3>
            <pre className="text-xs bg-red-50 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.lastError, null, 2)}
            </pre>
          </div>
        )}
        
        <div>
          <Button
            onClick={async () => {
              try {
                const response = await fetch('/api/get-admin-data')
                const data = await response.json()
                setDebugInfo(prev => ({
                  ...prev,
                  currentData: {
                    enginePackagesCount: data.data?.enginePackages?.length || 0,
                    timestamp: new Date().toISOString()
                  }
                }))
              } catch (error) {
                console.error('Debug fetch error:', error)
              }
            }}
            size="sm"
            variant="outline"
            className="w-full"
          >
            Verificar Dados Atuais
          </Button>
        </div>
        
        {debugInfo.currentData && (
          <div>
            <h3 className="font-semibold mb-2">Dados Atuais:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(debugInfo.currentData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}