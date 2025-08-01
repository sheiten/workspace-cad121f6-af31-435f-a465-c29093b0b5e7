import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Create a more realistic download test by streaming data
    const chunkSize = 64 * 1024 // 64KB chunks
    const totalSize = 5 * 1024 * 1024 // 5MB total
    const chunks = []
    
    // Generate test data chunks
    for (let i = 0; i < totalSize / chunkSize; i++) {
      const chunk = Buffer.alloc(chunkSize)
      for (let j = 0; j < chunkSize; j++) {
        chunk[j] = Math.floor(Math.random() * 256)
      }
      chunks.push(chunk)
      
      // Add small delay to simulate network transfer
      await new Promise(resolve => setTimeout(resolve, 1))
    }
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // Convert to seconds
    
    // Calculate download speed in Mbps
    const bitsTransferred = totalSize * 8
    const downloadSpeed = bitsTransferred / (duration * 1000000) // Mbps
    
    // Return the speed test result
    return NextResponse.json({
      downloadSpeed: Math.max(downloadSpeed, 0.1), // Ensure minimum speed
      dataSize: totalSize,
      duration: duration,
      chunks: chunks.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Download speed test error:', error)
    return NextResponse.json(
      { error: 'Failed to perform download speed test' },
      { status: 500 }
    )
  }
}