import { DatabaseService } from "@/lib/database-service"
import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_CONFIG } from "@/lib/cache-config"

// Force dynamic route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const timestamp = Date.now()
    console.log(`[${timestamp}] Saving admin data...`)
    
    const { enginePackages, hullColors, upholsteryPackages, additionalOptions, boatModels, dealers, orders, mode } =
      await req.json()

    if (mode === "upsert") {
      const promises = []
      if (enginePackages) promises.push(DatabaseService.saveEnginePackages(enginePackages))
      if (hullColors) promises.push(DatabaseService.saveHullColors(hullColors))
      if (upholsteryPackages) promises.push(DatabaseService.saveUpholsteryPackages(upholsteryPackages))
      if (additionalOptions) promises.push(DatabaseService.saveAdditionalOptions(additionalOptions))
      if (boatModels) promises.push(DatabaseService.saveBoatModels(boatModels))
      if (dealers) promises.push(DatabaseService.saveDealers(dealers))
      if (orders) promises.push(DatabaseService.saveOrders(orders))

      await Promise.all(promises)
      
      console.log(`[${timestamp}] Admin data saved successfully`)
      
      // Revalidate all paths and tags that might use this data
      revalidatePath('/dealer')
      revalidatePath('/dealer/inventory')
      revalidatePath('/dealer/after-sales') 
      revalidatePath('/administrator')
      revalidateTag('admin-data')
      revalidateTag('dealer-data')
    }

    const response = NextResponse.json({ 
      success: true,
      timestamp,
      message: "Data saved successfully"
    })
    
    // Apply all anti-cache headers
    Object.entries(CACHE_CONFIG.NO_CACHE_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Additional cache busting headers
    response.headers.set('X-Timestamp', timestamp.toString())
    response.headers.set('X-Data-Updated', 'true')
    
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Save admin data error:", errorMessage)
    const errorResponse = NextResponse.json({ 
      success: false, 
      error: errorMessage,
      timestamp: Date.now()
    }, { status: 500 })
    
    // Apply anti-cache headers to error responses too
    Object.entries(CACHE_CONFIG.NO_CACHE_HEADERS).forEach(([key, value]) => {
      errorResponse.headers.set(key, value)
    })
    
    return errorResponse
  }
}
