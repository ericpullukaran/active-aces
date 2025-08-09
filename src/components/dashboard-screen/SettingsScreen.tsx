"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import posthog from "posthog-js"
import React from "react"
import { Button } from "~/components/ui/button"
import { useTRPC, useTRPCClient } from "~/lib/trpc/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

export default function SettingsScreen() {
  const trpcClient = useTRPCClient()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const importMutation = useMutation(trpc.workouts.importCsv.mutationOptions())
  const deleteAllMutation = useMutation(
    trpc.workouts.deleteAll.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.workouts.history.pathKey(),
          refetchType: "all",
        })
      },
    }),
  )
  const [isExporting, setIsExporting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = React.useState(false)

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
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Manage your data.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Export data</CardTitle>
            <CardDescription>Download all workouts as CSV.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button onClick={handleExportCsv} isLoading={isExporting}>
              Export workout data (CSV)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import data</CardTitle>
            <CardDescription>Upload a CSV exported from Active Aces.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              // onChange={handleImportCsv}
            />
            <Button variant="outline" isLoading={importMutation.isPending} disabled>
              Import from CSV (coming soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
            <CardDescription>Delete all your previous workouts (not templates).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructiveOutline"
              isLoading={deleteAllMutation.isPending}
              onClick={() => setShowDeleteAllConfirmation(true)}
            >
              Delete all workouts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirm delete all dialog */}
      <Dialog open={showDeleteAllConfirmation} onOpenChange={setShowDeleteAllConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all workouts</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>Are you sure you want to delete all your workouts? This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex gap-4 sm:justify-start">
            <Button variant="outline" onClick={() => setShowDeleteAllConfirmation(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteAllMutation.isPending}
              onClick={() => {
                deleteAllMutation.mutate({ includeTemplates: false })
                setShowDeleteAllConfirmation(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
