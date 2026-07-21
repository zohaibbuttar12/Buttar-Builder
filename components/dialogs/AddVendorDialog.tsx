"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VendorForm } from "@/components/forms/VendorForm"
import { Vendor } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddVendorDialog({ onAdd }: { onAdd: (d: Omit<Vendor,"id">) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Vendor</Button></DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Vendor</DialogTitle></DialogHeader>
        <VendorForm onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
