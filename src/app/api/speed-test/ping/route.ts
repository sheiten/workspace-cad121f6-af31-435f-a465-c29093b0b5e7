import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Perform multiple ping tests to get average and jitter
    const pingCount = 10
    const pings: number[] = []
    
    for (let i = 0; i < pingCount; i++) {
      const pingStart = Date.now()
      
      // Simulate network latency with some randomness
      const baseLatency = 20 // Base latency in ms
      const randomVariation = Math.random() * 30 // Random variation 0-30ms
      const simulatedLatency = baseLatency + randomVariation
      
      await new Promise(resolve => setTimeout(resolve, simulatedLatency))
      
      const pingEnd = Date.now()
      const pingTime = pingEnd - pingStart
      pings.push(pingTime)
      
      // Small delay between pings
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    // Calculate average ping
    const averagePing = pings.reduce((sum, ping) => sum + ping, 0) / pings.length
    
    // Calculate jitter (standard deviation of ping times)
    const squaredDifferences = pings.map(ping => Math.pow(ping - averagePing, 2))
    const averageSquaredDiff = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / pings.length
    const jitter = Math.sqrt(averageSquaredDiff)
    
    // Calculate packet loss simulation (for demonstration)
    const packetLoss = Math.random() < 0.05 ? 1 : 0 // 5% chance of simulated packet loss
    
    // Return the ping test result
    return NextResponse.json({
      ping: Math.max(averagePing, 5), // Ensure minimum ping
      jitter: Math.max(jitter, 1), // Ensure minimum jitter
      packetLoss: packetLoss,
      pings: pings,
      pingCount: pingCount,
      minPing: Math.min(...pings),
      maxPing: Math.max(...pings),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Ping test error:', error)
    return NextResponse.json(
      { error: 'Failed to perform ping test' },
      { status: 500 }
    )
  }
}