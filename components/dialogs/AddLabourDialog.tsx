"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LabourForm } from "@/components/forms/LabourForm"
import { Labour, WorkerCategory } from "@/lib/types"
import { Plus } from "lucide-react"

export function AddLabourDialog({
  onAdd,
  categories,
  onAddCategory,
}: {
  onAdd: (d: Omit<Labour, "id">) => void
  categories: WorkerCategory[]
  onAddCategory: (name: string, description?: string) => Promise<WorkerCategory | null>
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Worker</Button></DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Worker</DialogTitle></DialogHeader>
        <LabourForm
          categories={categories}
          onAddCategory={onAddCategory}
          onSubmit={d => { onAdd(d); setOpen(false) }}
        />
      </DialogContent>
    </Dialog>
  )
}
