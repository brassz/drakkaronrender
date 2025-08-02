import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { headers } from "next/headers"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Get request headers
    const headersList = headers()
    const cacheControl = headersList.get('cache-control')
    
    // Force revalidation of all paths
    const pathsToRevalidate = [
      '/',
      '/dealer',
      '/dealer/new-boat',
      '/dealer/inventory',
      '/dealer/after-sales',
      '/dealer/marketing',
      '/dealer/quotes',
      '/dealer/sales',
      '/dealer/track-orders',
      '/administrator',
    ]
    
    pathsToRevalidate.forEach(path => {
      revalidatePath(path)
    })
    
    // Revalidate all tags
    const tagsToRevalidate = [
      'admin-data',
      'dealer-config',
      'orders',
      'quotes',
      'inventory',
    ]
    
    tagsToRevalidate.forEach(tag => {
      revalidateTag(tag)
    })
    
    const response = NextResponse.json({
      success: true,
      message: 'Cache cleared and paths revalidated',
      timestamp: new Date().toISOString(),
      requestCacheControl: cacheControl,
      revalidatedPaths: pathsToRevalidate,
      revalidatedTags: tagsToRevalidate,
    })
    
    // Add aggressive no-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Cache-Status', 'BYPASS')
    
    return response
  } catch (error) {
    console.error('Debug cache error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST() {
  return GET()
}