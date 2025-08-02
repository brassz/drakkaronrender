import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { CACHE_CONFIG } from "@/lib/cache-config"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Force dynamic route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Clear any potential caches
    const cacheBustingTimestamp = Date.now()
    console.log(`[${cacheBustingTimestamp}] Loading fresh data from database`)
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          'Cache-Control': 'no-cache',
          'X-Cache-Bust': cacheBustingTimestamp.toString()
        }
      }
    })

    // Helper function to safely query a table with cache busting
    const safeQuery = async (tableName: string, orderBy?: { column: string; ascending: boolean }) => {
      try {
        let query = supabase.from(tableName).select("*")

        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending })
        }

        // Add cache busting parameter
        const { data, error } = await query

        if (error) {
          console.error(`Error querying ${tableName}:`, error)
          return []
        }

        console.log(`[${cacheBustingTimestamp}] Loaded ${data?.length || 0} records from ${tableName}`)
        return data || []
      } catch (error) {
        console.error(`Exception querying ${tableName}:`, error)
        return []
      }
    }

    // Query all tables with individual error handling
    const [
      enginePackages,
      hullColors,
      upholsteryPackages,
      additionalOptions,
      boatModels,
      dealers,
      orders,
      serviceRequests,
      marketingContent,
      marketingManuals,
      marketingWarranties,
      factoryProduction,
    ] = await Promise.all([
      safeQuery("engine_packages", { column: "display_order", ascending: true }),
      safeQuery("hull_colors", { column: "display_order", ascending: true }),
      safeQuery("upholstery_packages", { column: "display_order", ascending: true }),
      safeQuery("additional_options", { column: "display_order", ascending: true }),
      safeQuery("boat_models", { column: "display_order", ascending: true }),
      safeQuery("dealers", { column: "display_order", ascending: true }),
      safeQuery("orders", { column: "created_at", ascending: false }),
      safeQuery("service_requests", { column: "created_at", ascending: false }),
      safeQuery("marketing_content", { column: "created_at", ascending: false }),
      safeQuery("marketing_manuals", { column: "display_order", ascending: true }),
      safeQuery("marketing_warranties", { column: "display_order", ascending: true }),
      safeQuery("factory_production", { column: "display_order", ascending: true }),
    ])

    console.log(`[${cacheBustingTimestamp}] All data loaded successfully`)

    // Clean up any potential JSON parsing issues in the data
    const cleanOrders = orders.map((order) => ({
      ...order,
      additional_options: Array.isArray(order.additional_options) ? order.additional_options : [],
    }))

    const cleanServiceRequests = serviceRequests.map((request) => ({
      ...request,
      issues: Array.isArray(request.issues) ? request.issues : [],
    }))

    const cleanFactoryProduction = factoryProduction.map((item) => ({
      ...item,
      additional_options: Array.isArray(item.additional_options) ? item.additional_options : [],
    }))

    const response = NextResponse.json({
      success: true,
      timestamp: cacheBustingTimestamp,
      data: {
        enginePackages,
        hullColors,
        upholsteryPackages,
        additionalOptions,
        boatModels,
        dealers,
        orders: cleanOrders,
        serviceRequests: cleanServiceRequests,
        marketingContent,
        marketingManuals,
        marketingWarranties,
        factoryProduction: cleanFactoryProduction,
      },
    })

    // Apply centralized no-cache headers with additional anti-cache measures
    Object.entries(CACHE_CONFIG.NO_CACHE_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Additional cache busting headers
    response.headers.set('X-Timestamp', cacheBustingTimestamp.toString())
    response.headers.set('X-Data-Fresh', 'true')
    response.headers.set('X-Cache-Status', 'MISS')

    return response
  } catch (error) {
    console.error("Error in get-admin-data:", error)
    const errorResponse = NextResponse.json({ 
      success: false, 
      error: "Internal server error",
      timestamp: Date.now()
    }, { status: 500 })
    
    // Apply centralized no-cache headers to error responses too
    Object.entries(CACHE_CONFIG.NO_CACHE_HEADERS).forEach(([key, value]) => {
      errorResponse.headers.set(key, value)
    })
    
    return errorResponse
  }
}
