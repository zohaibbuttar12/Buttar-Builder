"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EditLandSaleForm } from "@/components/forms/LandSaleForm"
import { LandSale } from "@/lib/types"
import { Pencil } from "lucide-react"

export function EditLandSaleDialog({
  landSale, onUpdate,
}: {
  landSale: LandSale
  onUpdate: (id: string, data: Partial<LandSale>) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setError(null) }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Pencil className="h-3.5 w-3.5" />Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Land Sale</DialogTitle></DialogHeader>
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
        <EditLandSaleForm
          landSale={landSale}
          onSubmit={async d => {
            try {
              await onUpdate(landSale.id, d)
              setOpen(false)
            } catch (e: any) {
              setError(e.message || "Failed to update land sale.")
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
