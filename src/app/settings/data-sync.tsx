import { useState } from "react"
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type DataSyncProps = {
  remainingUpload: number
}

async function uploadData() {
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: "data",
    }),
  })
}

export function DataSync({ remainingUpload }: DataSyncProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-fit">
        <Button className="w-fit">Sync</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Data Sync</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Upload your local data or download the latest uploaded data
        </DialogDescription>
        <div className="flex gap-2">
          <Button className="flex gap-2" onClick={uploadData}>
            <UploadIcon className="h-5 w-5" />
            Upload
          </Button>
          <Button className=" flex gap-2">
            <DownloadIcon className="h-5 w-5" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
