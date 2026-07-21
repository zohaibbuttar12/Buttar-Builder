"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AssignLandForm } from "@/components/forms/AssignLandForm"
import { PurchasedLand } from "@/lib/types"
import { MapPin } from "lucide-react"

export function AssignLandDialog({
  projectId, purchasedLands, onAssign,
}: {
  projectId: string
  purchasedLands: PurchasedLand[]
  onAssign: (d: any) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setError(null) }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2"><MapPin className="h-4 w-4" />Assign Purchased Land</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Assign Purchased Land</DialogTitle></DialogHeader>
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
        <AssignLandForm
          projectId={projectId}
          purchasedLands={purchasedLands}
          onError={setError}
          onSubmit={async d => {
            try {
              await onAssign(d)
              setOpen(false)
            } catch (e: any) {
              setError(e.message || "Failed to assign land.")
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
