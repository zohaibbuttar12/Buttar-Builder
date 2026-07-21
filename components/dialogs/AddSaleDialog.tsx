"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SaleForm } from "@/components/forms/SaleForm"
import { Sale, Project, Property } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddSaleDialog({ onAdd, projects, properties }: { onAdd: (d: Omit<Sale,"id">) => void; projects: Project[]; properties: Property[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Record Sale</Button></DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Record Property Sale</DialogTitle></DialogHeader>
        <SaleForm projects={projects} properties={properties} onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
