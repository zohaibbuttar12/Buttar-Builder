"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MaterialPurchaseForm } from "@/components/forms/MaterialPurchaseForm"
import { MaterialPurchase, Project, Vendor } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddMaterialPurchaseDialog({ onAdd, projects, vendors }: { onAdd: (d: Omit<MaterialPurchase,"id">) => void; projects: Project[]; vendors: Vendor[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Purchase</Button></DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Material Purchase</DialogTitle></DialogHeader>
        <MaterialPurchaseForm projects={projects} vendors={vendors} onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
