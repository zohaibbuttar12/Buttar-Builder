"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PropertyForm } from "@/components/forms/PropertyForm"
import { Property, Project } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddPropertyDialog({ onAdd, projects }: { onAdd: (d: Omit<Property,"id">) => void; projects: Project[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Property</Button></DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Property / Plot</DialogTitle></DialogHeader>
        <PropertyForm projects={projects} onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
