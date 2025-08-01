"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database-service"

interface TableStatus {
  name: string
  count: number
  lastUpdate: string | null
  status: "ok" | "error" | "loading"
  error?: string
}

export function DataPersistenceMonitor() {
  const [tables, setTables] = useState<TableStatus[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking")

  const tableNames = [
    { name: "engine_packages", label: "Pacotes de Motor" },
    { name: "hull_colors", label: "Cores de Casco" },
    { name: "upholstery_packages", label: "Pacotes de Estofamento" },
    { name: "additional_options", label: "Opções Adicionais" },
    { name: "boat_models", label: "Modelos de Barco" },
    { name: "dealers", label: "Revendedores" },
    { name: "orders", label: "Pedidos" },
    { name: "quotes", label: "Orçamentos" },
    { name: "service_requests", label: "Solicitações de Serviço" },
    { name: "factory_production", label: "Produção da Fábrica" },
  ]

  const checkConnection = async () => {
    setConnectionStatus("checking")
    try {
      const isConnected = await DatabaseService.testConnection()
      setConnectionStatus(isConnected ? "connected" : "disconnected")
      return isConnected
    } catch (error) {
      setConnectionStatus("disconnected")
      return false
    }
  }

  const checkTableStatus = async () => {
    setIsChecking(true)
    
    // First check connection
    const isConnected = await checkConnection()
    if (!isConnected) {
      setTables(tableNames.map(t => ({
        name: t.label,
        count: 0,
        lastUpdate: null,
        status: "error",
        error: "Sem conexão com o banco"
      })))
      setIsChecking(false)
      return
    }

    const newTables: TableStatus[] = []

    for (const table of tableNames) {
      try {
        let count = 0
        let lastUpdate = null

        // Get count based on table type
        switch (table.name) {
          case "engine_packages":
            const engines = await DatabaseService.getEnginePackages()
            count = engines.length
            lastUpdate = engines[0]?.created_at || null
            break
          case "hull_colors":
            const hulls = await DatabaseService.getHullColors()
            count = hulls.length
            lastUpdate = hulls[0]?.created_at || null
            break
          case "upholstery_packages":
            const upholstery = await DatabaseService.getUpholsteryPackages()
            count = upholstery.length
            lastUpdate = upholstery[0]?.created_at || null
            break
          case "additional_options":
            const options = await DatabaseService.getAdditionalOptions()
            count = options.length
            lastUpdate = options[0]?.created_at || null
            break
          case "boat_models":
            const models = await DatabaseService.getBoatModels()
            count = models.length
            lastUpdate = models[0]?.created_at || null
            break
          case "dealers":
            const dealers = await DatabaseService.getDealers()
            count = dealers.length
            lastUpdate = dealers[0]?.created_at || null
            break
          case "orders":
            const orders = await DatabaseService.getOrders()
            count = orders.length
            lastUpdate = orders[0]?.created_at || null
            break
          case "quotes":
            const quotes = await DatabaseService.getQuotes()
            count = quotes.length
            lastUpdate = quotes[0]?.created_at || null
            break
          case "service_requests":
            const requests = await DatabaseService.getServiceRequests()
            count = requests.length
            lastUpdate = requests[0]?.created_at || null
            break
        }

        newTables.push({
          name: table.label,
          count,
          lastUpdate,
          status: "ok"
        })
      } catch (error) {
        newTables.push({
          name: table.label,
          count: 0,
          lastUpdate: null,
          status: "error",
          error: String(error)
        })
      }
    }

    setTables(newTables)
    setLastCheck(new Date())
    setIsChecking(false)
  }

  useEffect(() => {
    checkTableStatus()
    // Check every 30 seconds
    const interval = setInterval(checkTableStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sem dados"
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Monitor de Persistência de Dados</h2>
        <button
          onClick={checkTableStatus}
          disabled={isChecking}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isChecking ? "Verificando..." : "Verificar Agora"}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected" ? "bg-green-500" : 
            connectionStatus === "disconnected" ? "bg-red-500" : 
            "bg-yellow-500"
          }`} />
          <span className="text-sm text-gray-600">
            Status da Conexão: {
              connectionStatus === "connected" ? "Conectado" :
              connectionStatus === "disconnected" ? "Desconectado" :
              "Verificando..."
            }
          </span>
        </div>
        {lastCheck && (
          <p className="text-sm text-gray-500 mt-1">
            Última verificação: {lastCheck.toLocaleString("pt-BR")}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Tabela</th>
              <th className="border border-gray-300 p-2 text-center">Status</th>
              <th className="border border-gray-300 p-2 text-center">Registros</th>
              <th className="border border-gray-300 p-2 text-left">Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.name} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{table.name}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {table.status === "ok" ? (
                    <span className="text-green-600">✅ OK</span>
                  ) : table.status === "loading" ? (
                    <span className="text-yellow-600">⏳ Carregando</span>
                  ) : (
                    <span className="text-red-600" title={table.error}>❌ Erro</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-center">{table.count}</td>
                <td className="border border-gray-300 p-2 text-sm text-gray-600">
                  {formatDate(table.lastUpdate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">Como garantir a persistência:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Sempre clique em "Salvar Tudo" após fazer alterações</li>
          <li>• Aguarde a mensagem de confirmação antes de sair</li>
          <li>• Em caso de erro, verifique a conexão e tente novamente</li>
          <li>• Os dados são salvos automaticamente ao reordenar itens</li>
        </ul>
      </div>
    </div>
  )
}