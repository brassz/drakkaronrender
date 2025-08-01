import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000'

async function testAPISave() {
  console.log('🔄 Testando salvamento através da API...\n')
  
  try {
    // Dados de teste
    const testData = {
      enginePackages: [
        {
          name: "API Test Engine " + Date.now(),
          name_pt: "Motor Teste API " + Date.now(),
          usd: 2000,
          brl: 10000,
          compatible_models: ["All Models"],
          countries: ["All"],
          display_order: 1
        }
      ],
      mode: "upsert"
    }
    
    console.log('📤 Enviando dados para /api/save-admin-data...')
    console.log('Dados:', JSON.stringify(testData, null, 2))
    
    const response = await fetch(`${BASE_URL}/api/save-admin-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify(testData)
    })
    
    const responseText = await response.text()
    console.log('\n📥 Resposta do servidor:')
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    
    try {
      const result = JSON.parse(responseText)
      console.log('Body:', JSON.stringify(result, null, 2))
      
      if (result.success) {
        console.log('\n✅ Salvamento via API funcionou!')
        
        // Verificar se os dados foram salvos
        console.log('\n🔄 Verificando dados salvos...')
        const getResponse = await fetch(`${BASE_URL}/api/get-admin-data`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        const getData = await getResponse.json()
        if (getData.success) {
          const savedEngine = getData.data.enginePackages.find((pkg: any) => 
            pkg.name.startsWith("API Test Engine")
          )
          
          if (savedEngine) {
            console.log('✅ Dados encontrados no banco:', savedEngine)
          } else {
            console.log('❌ Dados não foram encontrados no banco')
          }
        }
      } else {
        console.log('\n❌ Erro no salvamento:', result.error)
      }
    } catch (parseError) {
      console.log('Body (não é JSON):', responseText)
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error)
  }
}

// Executar teste
testAPISave()