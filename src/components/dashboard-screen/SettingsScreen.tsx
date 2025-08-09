"use client"

import { useMutation } from "@tanstack/react-query"
import posthog from "posthog-js"
import React from "react"
import { Button } from "~/components/ui/button"
import { useTRPC, useTRPCClient } from "~/lib/trpc/client"

export default function SettingsScreen() {
  const trpcClient = useTRPCClient()
  const trpc = useTRPC()
  const importMutation = useMutation(trpc.workouts.importCsv.mutationOptions())
  const [isExporting, setIsExporting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  async function handleExportCsv() {
    try {
      setIsExporting(true)
      const result = await trpcClient.workouts.history.exportCsv.query({ includeTemplates: false })
      const blob = new Blob([result.data], { type: result.mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      posthog.captureException(err)
    } finally {
      setIsExporting(false)
    }
  }

  async function handleImportCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      importMutation.mutate({ csv: text })
    } catch (err) {
      posthog.captureException(err)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Export or import your workout data.</p>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={handleExportCsv} isLoading={isExporting}>
            Export workout data (CSV)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            // onChange={handleImportCsv}
          />
          <Button
            variant="outline"
            isLoading={importMutation.isPending}
            disabled
            // onClick={() => fileInputRef.current?.click()}
          >
            Import from CSV (coming soon)
          </Button>
        </div>
      </div>
    </div>
  )
}
