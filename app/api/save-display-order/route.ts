import { DatabaseService } from "@/lib/database-service"
import { NextResponse } from "next/server"
import { CACHE_CONFIG } from "@/lib/cache-config"

export async function POST(req: Request) {
  try {
    const { type, items } = await req.json()

    if (!type || !items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 })
    }

    console.log(`🔄 Salvando ordem para tabela ${type}:`, items)

    // Update display_order for each item
    await DatabaseService.updateDisplayOrder(type, items)

    // Create response with success message
    const response = NextResponse.json({ 
      success: true, 
      message: `Display order updated for ${items.length} items in ${type}`,
      timestamp: new Date().toISOString()
    })

    // Apply centralized no-cache headers
    Object.entries(CACHE_CONFIG.NO_CACHE_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Save display order error:", errorMessage)
    
    const errorResponse = NextResponse.json({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })

    // Apply no-cache headers to error responses too
    Object.entries(CACHE_CONFIG.NO_CACHE_HEADERS).forEach(([key, value]) => {
      errorResponse.headers.set(key, value)
    })

    return errorResponse
  }
}
