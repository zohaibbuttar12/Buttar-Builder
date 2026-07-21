"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExpenseForm } from "@/components/forms/ExpenseForm"
import { Expense, Project } from "@/lib/types"
import { Plus } from "lucide-react"
export function AddExpenseDialog({ onAdd, projects }: { onAdd: (d: Omit<Expense,"id">) => void; projects: Project[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Expense</Button></DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
        <ExpenseForm projects={projects} onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
