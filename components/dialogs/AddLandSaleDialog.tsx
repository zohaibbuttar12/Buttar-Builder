"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LandSaleForm } from "@/components/forms/LandSaleForm"
import { PurchasedLand } from "@/lib/types"
import { Plus } from "lucide-react"

export function AddLandSaleDialog({
  purchasedLands, onAdd,
}: {
  purchasedLands: PurchasedLand[]
  onAdd: (d: any) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setError(null) }}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" />Record Land Sale</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Record Land Sale</DialogTitle></DialogHeader>
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
        <LandSaleForm
          purchasedLands={purchasedLands}
          onError={setError}
          onSubmit={async d => {
            try {
              await onAdd(d)
              setOpen(false)
            } catch (e: any) {
              setError(e.message || "Failed to record land sale.")
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
