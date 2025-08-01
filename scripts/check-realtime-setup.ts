import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkRealtimeSetup() {
  console.log('🔍 Verificando configuração do Supabase Realtime...\n')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Lista de tabelas que precisam ter realtime habilitado
  const tables = [
    'engine_packages',
    'hull_colors',
    'upholstery_packages',
    'additional_options',
    'boat_models',
    'dealers',
    'orders',
    'service_requests',
    'marketing_content',
    'marketing_manuals',
    'marketing_warranties',
    'factory_production',
    'dealer_inventory',
    'dealer_pricing'
  ]
  
  console.log('📋 Tabelas que precisam de Realtime habilitado:')
  tables.forEach(table => console.log(`   - ${table}`))
  
  console.log('\n⚠️  IMPORTANTE: Para habilitar o Realtime no Supabase:')
  console.log('1. Acesse o painel do Supabase')
  console.log('2. Vá para Database > Replication')
  console.log('3. Em "Source", clique em "0 tables" (ou o número atual)')
  console.log('4. Ative a replicação para todas as tabelas listadas acima')
  console.log('5. Clique em "Apply" para salvar as alterações')
  
  console.log('\n🔧 Alternativamente, execute este SQL no editor SQL do Supabase:')
  console.log('```sql')
  tables.forEach(table => {
    console.log(`ALTER PUBLICATION supabase_realtime ADD TABLE ${table};`)
  })
  console.log('```')
  
  console.log('\n✅ Após habilitar o Realtime, as alterações serão refletidas automaticamente!')
}

checkRealtimeSetup().catch(console.error)