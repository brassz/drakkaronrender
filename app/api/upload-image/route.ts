import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configurar Cloudinary (alternativa gratuita ao Vercel Blob)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop() || "jpg"
    const filename = `marketing-content/${timestamp}-${randomString}.${fileExtension}`

    try {
      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Upload to Cloudinary with retry logic
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "marketing-content",
            public_id: `${timestamp}-${randomString}`,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      }) as any

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        filename: filename,
      })
    } catch (uploadError: any) {
      console.error("Cloudinary upload error:", uploadError)

      // Handle specific Cloudinary errors
      if (uploadError.message?.includes("rate limit") || uploadError.message?.includes("Too Many")) {
        return NextResponse.json(
          {
            success: false,
            error: "Upload rate limit exceeded. Please wait a moment and try again.",
          },
          { status: 429 },
        )
      }

      if (uploadError.message?.includes("quota") || uploadError.message?.includes("storage")) {
        return NextResponse.json(
          {
            success: false,
            error: "Storage quota exceeded. Please contact administrator.",
          },
          { status: 507 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: `Upload failed: ${uploadError.message || "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${error.message || "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
