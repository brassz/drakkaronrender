import { NextRequest, NextResponse } from 'next/server'
import { testDatabaseConnection, testCloudinaryConnection } from '../../../test-render/database-connection'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const test = url.searchParams.get('test')

    switch (test) {
      case 'db':
        const dbResult = await testDatabaseConnection()
        return NextResponse.json(dbResult)
      
      case 'cloudinary':
        const cloudinaryResult = await testCloudinaryConnection()
        return NextResponse.json(cloudinaryResult)
      
      case 'all':
        const [dbTest, cloudinaryTest] = await Promise.all([
          testDatabaseConnection(),
          testCloudinaryConnection()
        ])
        
        return NextResponse.json({
          database: dbTest,
          cloudinary: cloudinaryTest,
          overall_status: dbTest.success && cloudinaryTest.success ? 'success' : 'partial_failure',
          timestamp: new Date().toISOString()
        })
      
      default:
        return NextResponse.json({
          message: 'Render Test API',
          available_tests: [
            '/api/test-render?test=db - Test database connection',
            '/api/test-render?test=cloudinary - Test Cloudinary connection', 
            '/api/test-render?test=all - Run all tests'
          ],
          timestamp: new Date().toISOString()
        })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Test API error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}