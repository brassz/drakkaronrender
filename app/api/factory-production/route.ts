import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("factory_production")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching factory production:", error)
      const errorResponse = NextResponse.json({ success: false, error: error.message }, { status: 500 })
      errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      errorResponse.headers.set('Pragma', 'no-cache')
      errorResponse.headers.set('Expires', '0')
      return errorResponse
    }

    const response = NextResponse.json({ success: true, data: data || [] })
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error("Error in factory production GET:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    return errorResponse
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await req.json()

    // Handle empty date strings - convert to null for PostgreSQL
    if (body.expected_completion_date === "") {
      body.expected_completion_date = null
    }

    const { data, error } = await supabase.from("factory_production").upsert(body).select()

    if (error) {
      console.error("Error saving factory production:", error)
      const errorResponse = NextResponse.json({ success: false, error: error.message }, { status: 500 })
      errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      errorResponse.headers.set('Pragma', 'no-cache')
      errorResponse.headers.set('Expires', '0')
      return errorResponse
    }

    const response = NextResponse.json({ success: true, data })
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error("Error in factory production POST:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    return errorResponse
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("factory_production").delete().eq("id", id)

    if (error) {
      console.error("Error deleting factory production:", error)
      const errorResponse = NextResponse.json({ success: false, error: error.message }, { status: 500 })
      errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      errorResponse.headers.set('Pragma', 'no-cache')
      errorResponse.headers.set('Expires', '0')
      return errorResponse
    }

    const response = NextResponse.json({ success: true })
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error("Error in factory production DELETE:", error)
    const errorResponse = NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    return errorResponse
  }
}
