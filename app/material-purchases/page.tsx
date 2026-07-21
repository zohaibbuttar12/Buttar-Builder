"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddMaterialPurchaseDialog } from "@/components/dialogs/AddMaterialPurchaseDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MaterialPurchaseForm } from "@/components/forms/MaterialPurchaseForm"
import { MaterialPurchase } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function MaterialPurchasesPage() {
  const { materialPurchases, projects, vendors, addMaterialPurchase, updateMaterialPurchase, deleteMaterialPurchase } = useData()
  const [editing, setEditing] = useState<MaterialPurchase|null>(null)
  const getProject = (id: string) => projects.find(p => p.id === id)?.name || "—"
  const total = materialPurchases.reduce((s,p) => s+p.total, 0)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Material Purchases</h1><p className="text-muted-foreground mt-1">Track material purchases</p></div>
        <AddMaterialPurchaseDialog projects={projects} vendors={vendors} onAdd={addMaterialPurchase} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6"><p className="text-sm text-muted-foreground">Total Cost</p><p className="text-2xl font-bold mt-1">{formatCurrency(total)}</p></Card>
        <Card className="p-6"><p className="text-sm text-muted-foreground">Total Purchases</p><p className="text-2xl font-bold mt-1">{materialPurchases.length}</p></Card>
        <Card className="p-6"><p className="text-sm text-muted-foreground">Average</p><p className="text-2xl font-bold mt-1">{materialPurchases.length ? formatCurrency(total/materialPurchases.length) : "—"}</p></Card>
      </div>
      <Card className="p-6">
        <DataTable
          columns={[
            { key:"materialType", label:"Material" },
            { key:"projectId", label:"Project", render: v => getProject(v) },
            { key:"vendorName", label:"Vendor" },
            { key:"quantity", label:"Qty", render: (v,r: any) => `${v} ${r.unit}` },
            { key:"total", label:"Total", render: v => formatCurrency(v) },
            { key:"date", label:"Date", render: v => formatDate(v) },
          ]}
          data={materialPurchases} onEdit={setEditing} onDelete={deleteMaterialPurchase}
          searchableColumns={["materialType","vendorName"]} getRowKey={p => p.id}
        />
      </Card>
      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Purchase</DialogTitle></DialogHeader>
            <MaterialPurchaseForm projects={projects} vendors={vendors} initialValues={editing} onSubmit={d => { updateMaterialPurchase(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
