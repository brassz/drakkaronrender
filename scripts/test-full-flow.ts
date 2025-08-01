import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://gobzlvsfluyokeixrlal.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvYnpsdnNmbHV5b2tlaXhybGFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg1ODA2MywiZXhwIjoyMDY2NDM0MDYzfQ.zoa1zKfFTGLDVXU_RIzQh5ym21E7gu41uV4xaPEJyvk"

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFullFlow() {
  console.log("🔄 Iniciando teste completo do fluxo de salvamento...\n")
  
  const testName = `Test Flow ${Date.now()}`
  let createdId: string | null = null
  
  try {
    // 1. Verificar estado inicial
    console.log("1️⃣ Verificando estado inicial...")
    const { data: initialData, error: initialError } = await supabase
      .from("engine_packages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
    
    if (initialError) {
      console.error("❌ Erro ao buscar dados iniciais:", initialError)
      return false
    }
    
    console.log(`✅ Encontrados ${initialData?.length || 0} pacotes de motor recentes`)
    
    // 2. Criar novo item
    console.log("\n2️⃣ Criando novo item...")
    const newItem = {
      name: testName,
      name_pt: `${testName} PT`,
      usd: 3000,
      brl: 15000,
      compatible_models: ["All Models"],
      countries: ["Brazil", "USA"],
      display_order: 999
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from("engine_packages")
      .insert([newItem])
      .select()
      .single()
    
    if (insertError) {
      console.error("❌ Erro ao inserir:", insertError)
      return false
    }
    
    createdId = insertData.id
    console.log("✅ Item criado com ID:", createdId)
    
    // 3. Verificar se foi salvo
    console.log("\n3️⃣ Verificando se foi salvo...")
    const { data: verifyData, error: verifyError } = await supabase
      .from("engine_packages")
      .select("*")
      .eq("id", createdId)
      .single()
    
    if (verifyError) {
      console.error("❌ Erro ao verificar:", verifyError)
      return false
    }
    
    console.log("✅ Item verificado no banco:", {
      id: verifyData.id,
      name: verifyData.name,
      countries: verifyData.countries
    })
    
    // 4. Atualizar o item
    console.log("\n4️⃣ Atualizando o item...")
    const { error: updateError } = await supabase
      .from("engine_packages")
      .update({
        usd: 3500,
        brl: 17500,
        countries: ["Brazil", "USA", "Canada"]
      })
      .eq("id", createdId)
    
    if (updateError) {
      console.error("❌ Erro ao atualizar:", updateError)
      return false
    }
    
    console.log("✅ Item atualizado")
    
    // 5. Verificar atualização
    console.log("\n5️⃣ Verificando atualização...")
    const { data: updatedData, error: updatedError } = await supabase
      .from("engine_packages")
      .select("*")
      .eq("id", createdId)
      .single()
    
    if (updatedError) {
      console.error("❌ Erro ao verificar atualização:", updatedError)
      return false
    }
    
    console.log("✅ Atualização confirmada:", {
      usd: updatedData.usd,
      brl: updatedData.brl,
      countries: updatedData.countries
    })
    
    // 6. Buscar todos os itens
    console.log("\n6️⃣ Buscando todos os itens...")
    const { data: allData, error: allError } = await supabase
      .from("engine_packages")
      .select("*")
      .order("display_order", { ascending: true })
    
    if (allError) {
      console.error("❌ Erro ao buscar todos:", allError)
      return false
    }
    
    console.log(`✅ Total de ${allData?.length || 0} itens no banco`)
    
    const ourItem = allData?.find(item => item.id === createdId)
    if (ourItem) {
      console.log("✅ Nosso item está na lista completa")
    } else {
      console.log("❌ Nosso item NÃO está na lista completa!")
      return false
    }
    
    return true
    
  } catch (error) {
    console.error("❌ Erro geral:", error)
    return false
  } finally {
    // Limpar dados de teste
    if (createdId) {
      console.log("\n🧹 Limpando dados de teste...")
      const { error: deleteError } = await supabase
        .from("engine_packages")
        .delete()
        .eq("id", createdId)
      
      if (deleteError) {
        console.error("⚠️ Não foi possível limpar dados de teste:", deleteError)
      } else {
        console.log("✅ Dados de teste removidos")
      }
    }
  }
}

// Executar teste
testFullFlow().then(success => {
  if (success) {
    console.log("\n✅ TODOS OS TESTES PASSARAM!")
    console.log("O fluxo de salvamento e recuperação está funcionando corretamente.")
  } else {
    console.log("\n❌ TESTES FALHARAM!")
    console.log("Há um problema no fluxo de salvamento ou recuperação.")
  }
  process.exit(success ? 0 : 1)
})