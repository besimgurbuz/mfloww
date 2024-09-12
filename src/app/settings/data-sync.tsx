import { useCallback, useEffect, useMemo, useState } from "react"
import { ClockIcon, DownloadIcon, UploadIcon } from "@radix-ui/react-icons"

import {
  useEncryptedTransactions,
  useImportEncryptedTransactions,
} from "@/lib/local-db/hooks"
import { EncryptedTransaction } from "@/lib/transaction"
import { formatTimePassedSince } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type SyncStatus = {
  hasSync: boolean
  createdAt: string | undefined
  expiresAt: string | undefined
}

async function fetchSyncStatus(): Promise<SyncStatus | null> {
  const res = await fetch("/api/sync/status")

  if (!res.ok) {
    return null
  }

  return await res.json()
}

async function uploadData(data: EncryptedTransaction[]) {
  const res = await fetch("/api/sync", {
    method: "POST",
    body: JSON.stringify(data),
  })

  return {
    ok: res.ok,
    data: await res.json(),
  }
}

async function downloadData(): Promise<
  | {
      ok: true
      data: EncryptedTransaction[]
    }
  | {
      ok: false
      data: { message: string }
    }
> {
  const res = await fetch("/api/sync", {
    method: "GET",
  })

  return {
    ok: res.ok,
    data: await res.json(),
  }
}

function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)

  const updateSyncStatus = useCallback(async () => {
    const status = await fetchSyncStatus()
    setSyncStatus(status)
  }, [])

  useEffect(() => {
    updateSyncStatus()
  }, [updateSyncStatus])

  return { syncStatus, updateSyncStatus }
}

function useDataUpload(
  toast: ReturnType<typeof useToast>["toast"],
  updateSyncStatus: () => Promise<void>
) {
  const { transactions } = useEncryptedTransactions()
  const [isUploading, setIsUploading] = useState(false)

  const uploadDataCallback = useCallback(async () => {
    setIsUploading(true)
    try {
      const { ok, data } = await uploadData(transactions)

      toast({
        title: ok ? "Upload Successful" : "Upload Failed",
        description: data.message,
        variant: ok ? "default" : "destructive",
      })

      return { ok, data }
    } finally {
      setIsUploading(false)
      await updateSyncStatus()
    }
  }, [transactions, updateSyncStatus, toast])

  return { uploadDataCallback, isUploading }
}

function useDataDownload(
  toast: ReturnType<typeof useToast>["toast"],
  closeDialog: () => void,
  importMode: "merge" | "replace",
  conflictResolution: "local" | "remote"
) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { importTransactions } = useImportEncryptedTransactions()

  const downloadDataCallback = useCallback(async () => {
    setIsDownloading(true)
    setIsImporting(true)
    try {
      const { ok, data } = await downloadData()

      if (ok) {
        await importTransactions(data, importMode, conflictResolution)
        setIsImporting(false)
      }

      toast({
        title: ok
          ? "Download and import successful"
          : "Download and import failed",
        description: ok
          ? "Data has been downloaded and imported into device."
          : data.message,
        variant: ok ? "default" : "destructive",
      })

      return { ok, data }
    } finally {
      setIsDownloading(false)
      closeDialog()
    }
  }, [importMode, conflictResolution, importTransactions, toast, closeDialog])

  return { downloadDataCallback, isDownloading, isImporting }
}

export function DataSync() {
  const { toast } = useToast()
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge")
  const [conflictResolution, setConflictResolution] = useState<
    "local" | "remote"
  >("remote")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { syncStatus, updateSyncStatus } = useSyncStatus()
  const { uploadDataCallback, isUploading } = useDataUpload(
    toast,
    updateSyncStatus
  )
  const { downloadDataCallback, isDownloading, isImporting } = useDataDownload(
    toast,
    () => setIsDialogOpen(false),
    importMode,
    conflictResolution
  )

  const lastUploadTime = useMemo(() => {
    if (!syncStatus?.createdAt) {
      return "never"
    }

    return formatTimePassedSince(syncStatus?.createdAt)
  }, [syncStatus?.createdAt])

  const availibilityTooltip = useMemo(() => {
    if (!syncStatus?.expiresAt) {
      return "No available data to download."
    }

    const expiresAt = new Date(syncStatus.expiresAt)
    const now = new Date()
    const diffInHours = Math.floor(
      (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours <= 0) {
      return "Data will be deleted in the next cycle."
    }

    return `Data is available for download for next ${diffInHours} hour${
      diffInHours > 1 ? "s" : ""
    }.`
  }, [syncStatus?.expiresAt])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <TooltipProvider>
          <Button
            className="flex gap-2"
            onClick={uploadDataCallback}
            disabled={isUploading}
          >
            {isUploading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <UploadIcon className="h-5 w-5" />
            )}
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    className="flex gap-2"
                    disabled={!syncStatus?.hasSync || isDownloading}
                  >
                    {isDownloading ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <DownloadIcon className="h-5 w-5" />
                    )}
                    {isDownloading ? "Downloading..." : "Download"}
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{availibilityTooltip}</TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download and Import Data</DialogTitle>
                <DialogDescription>
                  Choose how you want to import the downloaded data.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <RadioGroup
                  value={importMode}
                  onValueChange={(value) =>
                    setImportMode(value as "merge" | "replace")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="merge" id="merge" />
                    <Label htmlFor="merge">Merge</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="replace" id="replace" />
                    <Label htmlFor="replace">Replace</Label>
                  </div>
                </RadioGroup>
                {importMode === "merge" && (
                  <div className="grid gap-2">
                    <Label htmlFor="conflict-resolution">
                      Conflict Resolution
                    </Label>
                    <Select
                      value={conflictResolution}
                      onValueChange={(value) =>
                        setConflictResolution(value as "local" | "remote")
                      }
                    >
                      <SelectTrigger id="conflict-resolution">
                        <SelectValue placeholder="Select conflict resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Keep Local</SelectItem>
                        <SelectItem value="remote">Use Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  className="flex gap-2"
                  onClick={downloadDataCallback}
                  disabled={isDownloading}
                >
                  {isDownloading || isImporting ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <DownloadIcon className="h-5 w-5" />
                  )}
                  {isDownloading
                    ? "Downloading..."
                    : isImporting
                      ? "Importing..."
                      : "Download and import"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>
      {syncStatus?.hasSync && (
        <Badge
          variant="secondary"
          className="flex w-fit items-center gap-1 cursor-help"
        >
          <ClockIcon className="h-3 w-3" />
          Last upload was {lastUploadTime}
        </Badge>
      )}
    </div>
  )
}
