import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database-service"

export async function GET() {
  try {
    const dbService = new DatabaseService()
    const warranties = await dbService.getMarketingWarranties()

    const response = NextResponse.json({
      success: true,
      data: warranties,
    })
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error("Error fetching marketing warranties:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Failed to fetch warranties" }, { status: 500 })
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    return errorResponse
  }
}

export async function POST(request: NextRequest) {
  try {
    const warranty = await request.json()
    const dbService = new DatabaseService()
    const savedWarranty = await dbService.saveMarketingWarranty(warranty)

    const response = NextResponse.json({
      success: true,
      data: savedWarranty,
    })
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error("Error saving marketing warranty:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Failed to save warranty" }, { status: 500 })
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    return errorResponse
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 })
    }

    const dbService = new DatabaseService()
    await dbService.deleteMarketingWarranty(Number.parseInt(id))

    const response = NextResponse.json({
      success: true,
      message: "Warranty deleted successfully",
    })
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error("Error deleting marketing warranty:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Failed to delete warranty" }, { status: 500 })
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    return errorResponse
  }
}
