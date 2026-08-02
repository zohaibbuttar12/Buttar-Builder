"use client"
import { useMemo, useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddLabourDialog } from "@/components/dialogs/AddLabourDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LabourForm } from "@/components/forms/LabourForm"
import { Labour } from "@/lib/types"

const catColor: Record<string,string> = { mason:"bg-red-100 text-red-800", carpenter:"bg-orange-100 text-orange-800", electrician:"bg-yellow-100 text-yellow-800", plumber:"bg-blue-100 text-blue-800", painter:"bg-purple-100 text-purple-800", laborer:"bg-gray-100 text-gray-800", supervisor:"bg-green-100 text-green-800" }

export default function LaboursPage() {
  const {
    labours,
    workerCategories,
    addLabour,
    updateLabour,
    deleteLabour,
    addWorkerCategory,
  } = useData()
  const [editing, setEditing] = useState<Labour|null>(null)

  const categoryOptions = useMemo(
    () => workerCategories.filter((c) => c.isActive || labours.some((worker) => worker.category === c.name)),
    [workerCategories, labours]
  )

  const getCategoryColor = (name: string) => catColor[name.toLowerCase()] || "bg-gray-100 text-gray-800"

  async function handleAddCategory(name: string, description?: string) {
    const trimmed = name.trim()
    if (!trimmed) throw new Error("Category name is required.")

    try {
      const created = await addWorkerCategory({ name: trimmed, description: description?.trim() || "", isActive: true })
      return created
    } catch (error: any) {
      throw new Error(error?.message || "Unable to add category.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Labour Workers</h1><p className="text-muted-foreground mt-1">Manage workforce</p></div>
        <AddLabourDialog categories={categoryOptions} onAddCategory={handleAddCategory} onAdd={addLabour} />
      </div>

      <Card className="p-6">
        <DataTable
          columns={[
            { key:"name", label:"Worker Name" },
            { key:"category", label:"Category", render: v => <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(v)}`}>{v}</span> },
            { key:"phone", label:"Phone" },
            { key:"address", label:"Address" },
          ]}
          data={labours} onEdit={setEditing} onDelete={deleteLabour}
          searchableColumns={["name","phone","address"]} getRowKey={l => l.id}
        />
      </Card>

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Edit Worker</DialogTitle></DialogHeader>
            <LabourForm
              categories={categoryOptions}
              onAddCategory={handleAddCategory}
              initialValues={editing}
              onSubmit={d => { updateLabour(editing.id, d); setEditing(null) }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
