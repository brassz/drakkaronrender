import { createClient } from "@supabase/supabase-js"

// Configuração do Supabase
const supabaseUrl = "https://gobzlvsfluyokeixrlal.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvYnpsdnNmbHV5b2tlaXhybGFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg1ODA2MywiZXhwIjoyMDY2NDM0MDYzfQ.zoa1zKfFTGLDVXU_RIzQh5ym21E7gu41uV4xaPEJyvk"

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseConnection() {
  console.log("🔄 Testando conexão com o banco de dados...")
  
  try {
    // Teste 1: Verificar conexão básica
    const { data: testData, error: testError } = await supabase
      .from("engine_packages")
      .select("id")
      .limit(1)
    
    if (testError) {
      console.error("❌ Erro ao conectar com o banco:", testError)
      return false
    }
    
    console.log("✅ Conexão com o banco estabelecida!")
    
    // Teste 2: Tentar salvar um item de teste
    console.log("\n🔄 Testando salvamento de dados...")
    
    const testItem = {
      name: "Test Engine Package " + Date.now(),
      name_pt: "Pacote de Motor Teste " + Date.now(),
      usd: 1000,
      brl: 5000,
      compatible_models: ["All Models"],
      countries: ["All"],
      display_order: 999
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from("engine_packages")
      .insert([testItem])
      .select()
    
    if (insertError) {
      console.error("❌ Erro ao salvar dados:", insertError)
      return false
    }
    
    console.log("✅ Dados salvos com sucesso:", insertData)
    
    // Teste 3: Verificar se os dados foram realmente salvos
    if (insertData && insertData[0]) {
      const { data: verifyData, error: verifyError } = await supabase
        .from("engine_packages")
        .select("*")
        .eq("id", insertData[0].id)
        .single()
      
      if (verifyError) {
        console.error("❌ Erro ao verificar dados salvos:", verifyError)
        return false
      }
      
      console.log("✅ Dados verificados no banco:", verifyData)
      
      // Limpar dados de teste
      const { error: deleteError } = await supabase
        .from("engine_packages")
        .delete()
        .eq("id", insertData[0].id)
      
      if (deleteError) {
        console.error("⚠️ Aviso: Não foi possível limpar dados de teste:", deleteError)
      } else {
        console.log("🧹 Dados de teste removidos")
      }
    }
    
    return true
    
  } catch (error) {
    console.error("❌ Erro geral:", error)
    return false
  }
}

// Executar teste
testDatabaseConnection().then(success => {
  if (success) {
    console.log("\n✅ Todos os testes passaram! O salvamento está funcionando.")
  } else {
    console.log("\n❌ Testes falharam. Verifique os erros acima.")
  }
  process.exit(success ? 0 : 1)
})