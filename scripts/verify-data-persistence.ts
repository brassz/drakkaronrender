#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Tabelas para verificar
const tables = [
  'engine_packages',
  'hull_colors',
  'upholstery_packages',
  'additional_options',
  'boat_models',
  'dealers',
  'orders',
  'quotes',
  'service_requests',
  'factory_production',
  'marketing_content',
  'marketing_manuals',
  'marketing_warranties',
  'admin_settings'
]

async function verifyTable(tableName: string) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: false })
      .limit(1)

    if (error) {
      return {
        table: tableName,
        status: '❌ Erro',
        error: error.message,
        count: 0
      }
    }

    return {
      table: tableName,
      status: '✅ OK',
      error: null,
      count: count || 0
    }
  } catch (err) {
    return {
      table: tableName,
      status: '❌ Erro',
      error: String(err),
      count: 0
    }
  }
}

async function testDataPersistence() {
  console.log('🔍 Verificando persistência de dados no Supabase...\n')
  console.log(`URL: ${supabaseUrl}\n`)

  // Testar conexão
  console.log('📡 Testando conexão...')
  try {
    const { data, error } = await supabase.from('dealers').select('id').limit(1)
    if (error) throw error
    console.log('✅ Conexão estabelecida com sucesso!\n')
  } catch (error) {
    console.error('❌ Falha na conexão:', error)
    process.exit(1)
  }

  // Verificar cada tabela
  console.log('📊 Verificando tabelas:\n')
  console.log('Tabela                    | Status  | Registros | Erro')
  console.log('--------------------------|---------|-----------|---------------------')

  for (const table of tables) {
    const result = await verifyTable(table)
    const tableDisplay = table.padEnd(24)
    const statusDisplay = result.status.padEnd(7)
    const countDisplay = String(result.count).padStart(9)
    const errorDisplay = result.error || ''
    
    console.log(`${tableDisplay} | ${statusDisplay} | ${countDisplay} | ${errorDisplay}`)
  }

  // Teste de escrita
  console.log('\n📝 Testando escrita...')
  try {
    const testData = {
      key: 'test_persistence',
      value: new Date().toISOString()
    }

    const { error: upsertError } = await supabase
      .from('admin_settings')
      .upsert(testData)

    if (upsertError) throw upsertError

    // Verificar se foi salvo
    const { data: readData, error: readError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('key', 'test_persistence')
      .single()

    if (readError) throw readError

    if (readData && readData.value === testData.value) {
      console.log('✅ Teste de escrita bem-sucedido!')
      
      // Limpar teste
      await supabase
        .from('admin_settings')
        .delete()
        .eq('key', 'test_persistence')
    } else {
      console.log('❌ Falha no teste de escrita - dados não correspondem')
    }
  } catch (error) {
    console.error('❌ Erro no teste de escrita:', error)
  }

  console.log('\n✨ Verificação concluída!')
}

// Executar verificação
testDataPersistence().catch(console.error)