import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar se todas as variáveis de ambiente estão configuradas
    const requiredEnvVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY', 
      'CLOUDINARY_API_SECRET',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ]

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'warning',
        message: 'Some environment variables are missing',
        missing: missingVars,
        timestamp: new Date().toISOString()
      }, { status: 200 })
    }

    // Teste básico de conectividade
    const healthCheck = {
      status: 'healthy',
      message: 'Application is running successfully on Render',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      platform: 'render',
      node_version: process.version,
      memory_usage: process.memoryUsage(),
      uptime: process.uptime()
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}