"use client"

import { useState } from "react"
import { DatabaseService } from "@/lib/database-service"

export function DataPersistenceTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "disconnected">("unknown")

  const log = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const testConnection = async () => {
    setIsLoading(true)
    setResults([])
    
    try {
      log("🔍 Testando conexão com o banco...")
      const isConnected = await DatabaseService.testConnection()
      
      if (isConnected) {
        setConnectionStatus("connected")
        log("✅ Conexão estabelecida com sucesso!")
      } else {
        setConnectionStatus("disconnected")
        log("❌ Falha na conexão com o banco")
        return
      }

      // Test basic read operations
      log("📖 Testando operações de leitura...")
      const engines = await DatabaseService.getEnginePackages()
      log(`✅ Pacotes de motor carregados: ${engines.length} itens`)

      const hulls = await DatabaseService.getHullColors()
      log(`✅ Cores de casco carregadas: ${hulls.length} itens`)

      const dealers = await DatabaseService.getDealers()
      log(`✅ Revendedores carregados: ${dealers.length} itens`)

      // Test write operations with sample data
      log("💾 Testando operações de escrita...")
      
      const testEngine = {
        name: "Test Engine " + Date.now(),
        name_pt: "Motor Teste " + Date.now(),
        usd: 1000,
        brl: 5000,
        compatible_models: ["Test Model"],
        countries: ["All"],
        display_order: 999
      }

      log("📝 Criando pacote de motor de teste...")
      const saveResult = await DatabaseService.saveEnginePackages([testEngine])
      
      if (saveResult.insertedData.length > 0) {
        log("✅ Pacote de motor salvo com sucesso!")
        
        // Clean up test data
        const insertedId = saveResult.insertedData[0].id
        log("🧹 Removendo dados de teste...")
        await DatabaseService.deleteEnginePackage(insertedId)
        log("✅ Dados de teste removidos")
      } else {
        log("❌ Falha ao salvar pacote de motor")
      }

    } catch (error) {
      log(`❌ Erro durante o teste: ${error}`)
      setConnectionStatus("disconnected")
    } finally {
      setIsLoading(false)
    }
  }

  const testAdminDataSave = async () => {
    setIsLoading(true)
    setResults([])
    
    try {
      log("🔍 Testando API de salvamento administrativo...")
      
      const testData = {
        enginePackages: [{
          name: "API Test Engine " + Date.now(),
          name_pt: "Motor API Teste " + Date.now(),
          usd: 1500,
          brl: 7500,
          compatible_models: ["Test Model"],
          countries: ["All"],
          display_order: 998
        }],
        mode: "upsert"
      }

      log("📤 Enviando dados para /api/save-admin-data...")
      
      const response = await fetch("/api/save-admin-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(testData)
      })

      log(`📥 Resposta recebida: ${response.status} ${response.statusText}`)
      
      const result = await response.json()
      log(`📋 Resultado: ${JSON.stringify(result)}`)

      if (result.success) {
        log("✅ API de salvamento funcionando corretamente!")
      } else {
        log(`❌ API retornou erro: ${result.error}`)
      }

    } catch (error) {
      log(`❌ Erro na chamada da API: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Teste de Persistência de Dados</h2>
        <div className="flex space-x-2">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Testando..." : "Testar Conexão & CRUD"}
          </button>
          <button
            onClick={testAdminDataSave}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isLoading ? "Testando..." : "Testar API Admin"}
          </button>
          <button
            onClick={clearResults}
            disabled={isLoading}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected" ? "bg-green-500" : 
            connectionStatus === "disconnected" ? "bg-red-500" : 
            "bg-gray-400"
          }`} />
          <span className="text-sm text-gray-600">
            Status da Conexão: {
              connectionStatus === "connected" ? "Conectado" :
              connectionStatus === "disconnected" ? "Desconectado" :
              "Desconhecido"
            }
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded p-4 h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Log de Teste:</h3>
        {results.length === 0 ? (
          <p className="text-gray-500 italic">Clique em um dos botões acima para iniciar os testes</p>
        ) : (
          <div className="space-y-1">
            {results.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold text-yellow-900 mb-2">Como usar este teste:</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• <strong>Testar Conexão & CRUD:</strong> Verifica conexão e operações básicas do banco</li>
          <li>• <strong>Testar API Admin:</strong> Testa especificamente a API usada pelo painel administrativo</li>
          <li>• Se algum teste falhar, o log mostrará onde está o problema</li>
          <li>• Logs detalhados também aparecerão no console do navegador</li>
        </ul>
      </div>
    </div>
  )
}