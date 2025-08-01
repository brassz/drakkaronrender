import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database-service"

const db = new DatabaseService()

export async function GET() {
  try {
    const manuals = await db.getMarketingManuals()
    const response = NextResponse.json({ success: true, data: manuals })
    
    // Add no-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error("Error fetching marketing manuals:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Failed to fetch marketing manuals" }, { status: 500 })
    
    // Add no-cache headers to error responses too
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    
    return errorResponse
  }
}

export async function POST(request: NextRequest) {
  try {
    const manual = await request.json()

    // Validate required fields
    if (!manual.name_en || !manual.name_pt || !manual.url) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await db.saveMarketingManual(manual)
    const response = NextResponse.json({ success: true, data: result })
    
    // Add no-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error("Error saving marketing manual:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Failed to save marketing manual" }, { status: 500 })
    
    // Add no-cache headers to error responses too
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    
    return errorResponse
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Manual ID is required" }, { status: 400 })
    }

    await db.deleteMarketingManual(Number.parseInt(id))
    const response = NextResponse.json({ success: true })
    
    // Add no-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error("Error deleting marketing manual:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Failed to delete marketing manual" }, { status: 500 })
    
    // Add no-cache headers to error responses too
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    
    return errorResponse
  }
}
