import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente essenciais estão configuradas
    const requiredEnvVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Missing environment variables",
          missing: missingVars,
        },
        { status: 503 }
      )
    }

    // Retornar status de saúde
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "0.1.0",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}