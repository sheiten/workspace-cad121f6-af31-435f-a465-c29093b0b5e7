import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Get the request body
    const body = await request.json()
    const testData = body.testData || ''
    
    // Simulate processing the uploaded data in chunks
    const chunkSize = 1024 // 1KB chunks
    const totalChunks = Math.ceil(testData.length / chunkSize)
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, testData.length)
      const chunk = testData.substring(start, end)
      
      // Process the chunk (simulate server-side processing)
      await new Promise(resolve => setTimeout(resolve, 2))
      
      // Calculate checksum or perform some operation on the chunk
      const processedChunk = chunk.split('').reverse().join('')
    }
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // Convert to seconds
    
    // Calculate the size of the uploaded data
    const dataSize = new Blob([testData]).size
    
    // Calculate upload speed in Mbps
    const bitsTransferred = dataSize * 8
    const uploadSpeed = bitsTransferred / (duration * 1000000) // Mbps
    
    // Return the speed test result
    return NextResponse.json({
      uploadSpeed: Math.max(uploadSpeed, 0.05), // Ensure minimum speed
      dataSize: dataSize,
      duration: duration,
      chunksProcessed: totalChunks,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Upload speed test error:', error)
    return NextResponse.json(
      { error: 'Failed to perform upload speed test' },
      { status: 500 }
    )
  }
}