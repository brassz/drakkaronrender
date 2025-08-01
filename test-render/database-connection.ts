import { createClient } from '@supabase/supabase-js'

export async function testDatabaseConnection() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Teste básico de conexão
    const { data, error } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1)

    if (error && !error.message.includes('relation "test_connection" does not exist')) {
      throw error
    }

    return {
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}

export async function testCloudinaryConnection() {
  try {
    const requiredVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ]

    const missingVars = requiredVars.filter(envVar => !process.env[envVar])
    
    if (missingVars.length > 0) {
      throw new Error(`Missing Cloudinary environment variables: ${missingVars.join(', ')}`)
    }

    // Teste básico de configuração
    const { v2: cloudinary } = await import('cloudinary')
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Verificar se a configuração está correta
    const result = await cloudinary.api.ping()

    return {
      success: true,
      message: 'Cloudinary connection successful',
      timestamp: new Date().toISOString(),
      cloudinary_status: result
    }
  } catch (error) {
    return {
      success: false,
      message: 'Cloudinary connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}