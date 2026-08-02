"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Labour, WorkerCategory } from "@/lib/types"

const buildLabourForm = (initialValues?: Partial<Labour>, categories: WorkerCategory[] = []) => {
  const fallback = categories.find(c => c.isActive)?.name || ""
  return {
    name: initialValues?.name || "",
    category: initialValues?.category || fallback,
    phone: initialValues?.phone || "",
    address: initialValues?.address || "",
  }
}

export function LabourForm({
  onSubmit,
  initialValues,
  categories = [],
  onAddCategory,
}: {
  onSubmit: (d: any) => void
  initialValues?: Partial<Labour>
  categories?: WorkerCategory[]
  onAddCategory?: (name: string, description?: string) => Promise<WorkerCategory | null>
}) {
  const [f, setF] = useState(() => buildLabourForm(initialValues, categories))
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [categoryMessage, setCategoryMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isSavingCategory, setIsSavingCategory] = useState(false)

  useEffect(() => {
    setF(buildLabourForm(initialValues, categories))
  }, [initialValues, categories])

  const activeCategories = categories.filter(c => c.isActive || c.name === f.category)

  async function handleAddCategory() {
    const trimmed = categoryName.trim()
    if (!trimmed || !onAddCategory) return

    setIsSavingCategory(true)
    setCategoryMessage(null)
    try {
      const created = await onAddCategory(trimmed, categoryDescription.trim() || undefined)
      if (created) {
        setF((prev) => ({ ...prev, category: created.name }))
        setCategoryName("")
        setCategoryDescription("")
        setCategoryModalOpen(false)
        setCategoryMessage({ type: "success", text: `Category "${created.name}" added successfully.` })
      }
    } catch (error: any) {
      setCategoryMessage({ type: "error", text: error?.message || "Failed to add category." })
    } finally {
      setIsSavingCategory(false)
    }
  }

  return (
    <>
      <form onSubmit={e => { e.preventDefault(); onSubmit(f) }} className="space-y-4">
        <div className="space-y-1"><Label>Worker Name *</Label><Input value={f.name} onChange={e => setF({...f, name: e.target.value})} required /></div>
        <div className="space-y-1">
          <Label>Category *</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select value={f.category || ""} onValueChange={v => setF({...f, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {activeCategories.length > 0 ? activeCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>) : <div className="px-2 py-1 text-sm text-muted-foreground">No categories available</div>}
                </SelectContent>
              </Select>
            </div>
            {onAddCategory && (
              <Button type="button" variant="outline" size="sm" onClick={() => setCategoryModalOpen(true)} className="whitespace-nowrap">+ Add Category</Button>
            )}
          </div>
        </div>
        <div className="space-y-1"><Label>Phone</Label><Input value={f.phone} onChange={e => setF({...f, phone: e.target.value})} /></div>
        <div className="space-y-1"><Label>Address</Label><Textarea value={f.address} onChange={e => setF({...f, address: e.target.value})} rows={2} /></div>
        {categoryMessage && (
          <div className={`rounded-md border px-3 py-2 text-sm ${categoryMessage.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {categoryMessage.text}
          </div>
        )}
        <Button type="submit" className="w-full">{initialValues?.id ? "Update Worker" : "Add Worker"}</Button>
      </form>

      {onAddCategory && (
        <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Add Worker Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Category Name</Label>
                <Input value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Mason" autoFocus />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input value={categoryDescription} onChange={e => setCategoryDescription(e.target.value)} placeholder="Optional description" />
              </div>
              {categoryMessage && (
                <div className={`rounded-md border px-3 py-2 text-sm ${categoryMessage.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                  {categoryMessage.text}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
                <Button type="button" onClick={handleAddCategory} disabled={isSavingCategory || !categoryName.trim()}>
                  {isSavingCategory ? "Saving..." : "Save Category"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
