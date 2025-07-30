"use client"

import { AlertTriangle, RefreshCw, Home, Bug, Trash } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error("Global error:", error.message, error.digest)

  const handleReportError = () => {
    // You can implement error reporting here (e.g., send to analytics service)
    const errorInfo = {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
    }
    console.log("Error report:", errorInfo)
    // Example: Send to your error tracking service
    // analytics.track('error_reported', errorInfo)
  }

  const hardReset = () => {
    localStorage.clear()
    reset()
  }

  return (
    <html>
      <head>
        <title>Something went wrong - Active Aces</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/90 text-center backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 ring-2 ring-red-500/30">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-zinc-100">Oops! Something went wrong</CardTitle>
            <CardDescription className="text-zinc-300">
              We encountered an unexpected error while loading the application. Don't worry, our
              team has been notified and we're working to fix this.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error.message && (
              <div className="rounded-lg border border-zinc-600/50 bg-zinc-900/60 p-4 text-left">
                <h4 className="mb-2 text-sm font-medium text-zinc-200">Error Details:</h4>
                <div className="rounded border border-zinc-700 bg-zinc-950/50 p-3">
                  <p className="font-mono text-xs leading-relaxed break-all text-zinc-300">
                    {error.message}
                    {error.digest && (
                      <span className="mt-1 block text-zinc-400">Error ID: {error.digest}</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button onClick={reset} className="bg-primary w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              <div className="flex gap-3">
                <Button onClick={hardReset} variant="destructive" className="flex-1">
                  <Trash className="mr-2 h-4 w-4" />
                  Hard Reset
                </Button>

                <Button onClick={handleReportError} variant="outline" className="flex-1">
                  <Bug className="mr-2 h-4 w-4" />
                  Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </body>
    </html>
  )
}
