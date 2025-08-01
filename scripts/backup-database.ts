#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Tables to backup
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
  'admin_settings',
  'dealer_inventory',
  'dealer_pricing',
  'boat_sales',
  'service_messages'
]

async function backupTable(tableName: string) {
  try {
    console.log(`📊 Fazendo backup de ${tableName}...`)
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error(`❌ Erro ao fazer backup de ${tableName}:`, error.message)
      return null
    }

    return {
      table: tableName,
      data: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    console.error(`❌ Erro ao fazer backup de ${tableName}:`, err)
    return null
  }
}

async function createBackup() {
  console.log('🚀 Iniciando backup do banco de dados...\n')

  const backup: any = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    supabaseUrl: supabaseUrl,
    tables: {}
  }

  let totalRecords = 0

  for (const table of tables) {
    const tableBackup = await backupTable(table)
    if (tableBackup) {
      backup.tables[table] = tableBackup
      totalRecords += tableBackup.count
      console.log(`✅ ${table}: ${tableBackup.count} registros`)
    }
  }

  // Create backups directory if it doesn't exist
  const backupsDir = path.join(process.cwd(), 'backups')
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir)
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const filename = `backup-${timestamp}.json`
  const filepath = path.join(backupsDir, filename)

  // Write backup file
  fs.writeFileSync(filepath, JSON.stringify(backup, null, 2))

  console.log('\n✨ Backup concluído!')
  console.log(`📁 Arquivo: ${filepath}`)
  console.log(`📊 Total de registros: ${totalRecords}`)
  console.log(`📅 Data/Hora: ${new Date().toLocaleString('pt-BR')}`)

  // Create a latest.json symlink for easy access
  const latestPath = path.join(backupsDir, 'latest.json')
  if (fs.existsSync(latestPath)) {
    fs.unlinkSync(latestPath)
  }
  fs.copyFileSync(filepath, latestPath)
  console.log(`🔗 Link atualizado: ${latestPath}`)

  // Clean old backups (keep only last 7 days)
  cleanOldBackups(backupsDir)
}

function cleanOldBackups(backupsDir: string) {
  const files = fs.readdirSync(backupsDir)
  const now = Date.now()
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
  
  let deletedCount = 0
  
  files.forEach(file => {
    if (file.startsWith('backup-') && file.endsWith('.json') && file !== 'latest.json') {
      const filepath = path.join(backupsDir, file)
      const stats = fs.statSync(filepath)
      
      if (stats.mtime.getTime() < sevenDaysAgo) {
        fs.unlinkSync(filepath)
        deletedCount++
      }
    }
  })
  
  if (deletedCount > 0) {
    console.log(`\n🗑️  ${deletedCount} backup(s) antigo(s) removido(s) (mais de 7 dias)`)
  }
}

// Execute backup
createBackup().catch(console.error)