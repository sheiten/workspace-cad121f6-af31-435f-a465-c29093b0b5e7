'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Download, Upload, Zap } from 'lucide-react'

interface SpeedTestResult {
  download: number
  upload: number
  ping: number
  jitter: number
}

interface TestStatus {
  isTesting: boolean
  currentTest: 'idle' | 'ping' | 'download' | 'upload' | 'complete'
  progress: number
}

export default function Home() {
  const [result, setResult] = useState<SpeedTestResult | null>(null)
  const [status, setStatus] = useState<TestStatus>({
    isTesting: false,
    currentTest: 'idle',
    progress: 0
  })

  const startSpeedTest = async () => {
    setStatus({ isTesting: true, currentTest: 'ping', progress: 0 })
    setResult(null)

    try {
      // Test ping
      setStatus({ isTesting: true, currentTest: 'ping', progress: 20 })
      const pingResponse = await fetch('/api/speed-test/ping')
      const pingData = await pingResponse.json()

      // Test download
      setStatus({ isTesting: true, currentTest: 'download', progress: 50 })
      const downloadResponse = await fetch('/api/speed-test/download')
      const downloadData = await downloadResponse.json()

      // Test upload
      setStatus({ isTesting: true, currentTest: 'upload', progress: 80 })
      const uploadResponse = await fetch('/api/speed-test/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testData: 'x'.repeat(1024 * 1024) }) // 1MB test data
      })
      const uploadData = await uploadResponse.json()

      const finalResult: SpeedTestResult = {
        ping: pingData.ping,
        jitter: pingData.jitter,
        download: downloadData.downloadSpeed,
        upload: uploadData.uploadSpeed
      }

      setResult(finalResult)
      setStatus({ isTesting: true, currentTest: 'complete', progress: 100 })
      
      setTimeout(() => {
        setStatus({ isTesting: false, currentTest: 'idle', progress: 0 })
      }, 2000)

    } catch (error) {
      console.error('Speed test failed:', error)
      setStatus({ isTesting: false, currentTest: 'idle', progress: 0 })
    }
  }

  const getTestStatusText = () => {
    switch (status.currentTest) {
      case 'ping': return 'Testing ping...'
      case 'download': return 'Testing download speed...'
      case 'upload': return 'Testing upload speed...'
      case 'complete': return 'Test complete!'
      default: return 'Ready to test'
    }
  }

  const formatSpeed = (speed: number) => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(2)} Gbps`
    } else if (speed >= 1) {
      return `${speed.toFixed(2)} Mbps`
    } else {
      return `${(speed * 1000).toFixed(0)} Kbps`
    }
  }

  const formatPing = (ping: number) => {
    return `${ping.toFixed(0)} ms`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Internet Speed Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Measure your internet connection speed with precision
          </p>
        </div>

        {/* Main Test Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Activity className="w-6 h-6" />
              Speed Test
            </CardTitle>
            <CardDescription>
              Test your download speed, upload speed, and ping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Button */}
            <div className="text-center">
              <Button 
                onClick={startSpeedTest} 
                disabled={status.isTesting}
                size="lg"
                className="w-full sm:w-auto"
              >
                {status.isTesting ? 'Testing...' : 'Start Speed Test'}
              </Button>
            </div>

            {/* Progress */}
            {status.isTesting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>{getTestStatusText()}</span>
                  <span>{status.progress}%</span>
                </div>
                <Progress value={status.progress} className="w-full" />
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Download Speed */}
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Download className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Download</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatSpeed(result.download)}
                    </div>
                    <div className="text-sm text-gray-500">Speed</div>
                  </CardContent>
                </Card>

                {/* Upload Speed */}
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Upload</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatSpeed(result.upload)}
                    </div>
                    <div className="text-sm text-gray-500">Speed</div>
                  </CardContent>
                </Card>

                {/* Ping */}
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold">Ping</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatPing(result.ping)}
                    </div>
                    <div className="text-sm text-gray-500">Latency</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Loading State */}
            {status.isTesting && !result && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4 text-center space-y-2">
                      <Skeleton className="h-6 w-6 mx-auto" />
                      <Skeleton className="h-8 w-24 mx-auto" />
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Connection Quality */}
            {result && (
              <div className="text-center">
                <h3 className="font-semibold mb-2">Connection Quality</h3>
                <div className="flex justify-center gap-2">
                  <Badge variant={result.ping < 50 ? "default" : result.ping < 100 ? "secondary" : "destructive"}>
                    {result.ping < 50 ? "Excellent" : result.ping < 100 ? "Good" : "Poor"} Ping
                  </Badge>
                  <Badge variant={result.download > 50 ? "default" : result.download > 10 ? "secondary" : "destructive"}>
                    {result.download > 50 ? "Fast" : result.download > 10 ? "Average" : "Slow"} Download
                  </Badge>
                  <Badge variant={result.upload > 20 ? "default" : result.upload > 5 ? "secondary" : "destructive"}>
                    {result.upload > 20 ? "Fast" : result.upload > 5 ? "Average" : "Slow"} Upload
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>About This Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This speed test measures your internet connection by:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>Testing ping (latency) to measure response time</li>
              <li>Downloading test data to measure download speed</li>
              <li>Uploading test data to measure upload speed</li>
              <li>Calculating jitter (ping variation) for connection stability</li>
            </ul>
            <p className="text-sm text-gray-500">
              For accurate results, close other applications that use internet bandwidth during the test.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}