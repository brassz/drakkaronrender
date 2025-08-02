import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Apply aggressive no-cache headers to all requests
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('Vary', '*')
  response.headers.set('X-No-Cache', 'true')
  response.headers.set('X-Timestamp', Date.now().toString())
  
  // For API routes, add additional anti-cache headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"')
    response.headers.set('X-API-Fresh', 'true')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}