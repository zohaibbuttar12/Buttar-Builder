"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LabourForm } from "@/components/forms/LabourForm"
import { Labour } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddLabourDialog({ onAdd }: { onAdd: (d: Omit<Labour,"id">) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Worker</Button></DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Worker</DialogTitle></DialogHeader>
        <LabourForm onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
