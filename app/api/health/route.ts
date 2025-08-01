import { NextResponse } from 'next/server'
import { checkSupabaseConnection } from '@/lib/supabase-render'

export async function GET() {
  try {
    // Check Supabase connection
    const dbHealth = await checkSupabaseConnection()
    
    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    const isHealthy = dbHealth.success && Object.values(envCheck).every(Boolean)

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      environment: envCheck,
      version: process.env.npm_package_version || '1.0.0'
    }, {
      status: isHealthy ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 503
    })
  }
}