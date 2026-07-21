"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PartnerForm } from "@/components/forms/PartnerForm"
import { Partner } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddPartnerDialog({ onAdd }: { onAdd: (d: Omit<Partner,"id">) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Partner</Button></DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Partner</DialogTitle></DialogHeader>
        <PartnerForm onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
