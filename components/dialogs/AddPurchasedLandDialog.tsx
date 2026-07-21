"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PurchasedLandForm } from "@/components/forms/PurchasedLandForm"
import { PurchasedLand } from "@/lib/types"
import { Plus } from "lucide-react"

export function AddPurchasedLandDialog({ onAdd }: { onAdd: (d: Omit<PurchasedLand,"id">) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Purchased Land</Button></DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Purchased Land</DialogTitle></DialogHeader>
        <PurchasedLandForm onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
