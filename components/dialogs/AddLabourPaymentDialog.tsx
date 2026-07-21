"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LabourPaymentForm } from "@/components/forms/LabourPaymentForm"
import { Labour, LabourPayment, Project } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddLabourPaymentDialog({ onAdd, projects, labours }: { onAdd: (d: Omit<LabourPayment,"id">) => void; projects: Project[]; labours: Labour[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Payment</Button></DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Labour Payment</DialogTitle></DialogHeader>
        <LabourPaymentForm projects={projects} labours={labours} onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
