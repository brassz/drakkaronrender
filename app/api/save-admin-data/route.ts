import { DatabaseService } from "@/lib/database-service"
import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(req: Request) {
  try {
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
      
      // Revalidate all paths and tags that might use this data
      revalidatePath('/', 'layout')
      revalidatePath('/dealer', 'layout')
      revalidatePath('/dealer/new-boat', 'page')
      revalidatePath('/dealer/inventory', 'page')
      revalidatePath('/dealer/after-sales', 'page')
      revalidatePath('/dealer/marketing', 'page')
      revalidatePath('/dealer/quotes', 'page')
      revalidatePath('/dealer/sales', 'page')
      revalidatePath('/dealer/track-orders', 'page')
      revalidatePath('/administrator', 'page')
      
      // Revalidate tags
      revalidateTag('admin-data')
      revalidateTag('dealer-config')
      revalidateTag('inventory')
      revalidateTag('orders')
    }

    const response = NextResponse.json({ success: true })
    
    // Add no-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Save admin data error:", errorMessage)
    const errorResponse = NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
    
    // Add no-cache headers to error responses too
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    
    return errorResponse
  }
}
