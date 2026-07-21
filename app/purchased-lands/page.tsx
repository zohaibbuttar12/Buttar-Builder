"use client"
import { useState } from "react"
import Link from "next/link"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddPurchasedLandDialog } from "@/components/dialogs/AddPurchasedLandDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PurchasedLandForm } from "@/components/forms/PurchasedLandForm"
import { PurchasedLand } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  partially_used: "bg-yellow-100 text-yellow-800",
  fully_used: "bg-gray-100 text-gray-800",
}
const STATUS_LABELS: Record<string, string> = {
  available: "Available", partially_used: "Partially Used", fully_used: "Fully Used",
}

export default function PurchasedLandsPage() {
  const { purchasedLands, addPurchasedLand, updatePurchasedLand, deletePurchasedLand } = useData()
  const [editing, setEditing] = useState<PurchasedLand | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const totalArea = purchasedLands.reduce((s, p) => s + p.totalArea, 0)
  const totalUsed = purchasedLands.reduce((s, p) => s + (p.usedArea || 0), 0)
  const totalAvailable = purchasedLands.reduce((s, p) => s + (p.availableArea || 0), 0)
  const totalInvested = purchasedLands.reduce((s, p) => s + (p.totalCost || 0), 0)

  async function handleDelete(id: string) {
    setDeleteError(null)
    try {
      await deletePurchasedLand(id)
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete plot.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchased Lands</h1>
          <p className="text-muted-foreground mt-1">Company-owned land inventory, separate from project assignments</p>
        </div>
        <AddPurchasedLandDialog onAdd={addPurchasedLand} />
      </div>

      {deleteError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">{deleteError}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Plots</p><p className="text-2xl font-bold mt-1">{purchasedLands.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Area Owned</p><p className="text-2xl font-bold mt-1">{totalArea.toLocaleString()}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Area Remaining</p><p className="text-2xl font-bold mt-1 text-green-600">{totalAvailable.toLocaleString()}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Invested</p><p className="text-xl font-bold mt-1">{formatCurrency(totalInvested)}</p></Card>
      </div>

      <Card className="p-6">
        <DataTable
          columns={[
            { key: "plotName", label: "Plot Name", render: (v, r: any) => <Link href={`/purchased-lands/${r.id}`} className="text-primary font-medium hover:underline">{v}</Link> },
            { key: "plotNumber", label: "Plot #" },
            { key: "totalArea", label: "Total Area", render: (v, r: any) => `${v} ${r.unit}` },
            { key: "usedArea", label: "Used", render: (v, r: any) => `${v || 0} ${r.unit}` },
            { key: "availableArea", label: "Available", render: (v, r: any) => <span className="font-medium text-green-700">{v || 0} {r.unit}</span> },
            { key: "totalCost", label: "Total Cost", render: v => formatCurrency(v || 0) },
            { key: "costPerUnit", label: "Cost/Unit", render: v => formatCurrency(v || 0) },
            { key: "purchaseDate", label: "Purchased", render: v => v ? formatDate(v) : "—" },
            { key: "status", label: "Status", render: v => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[v] || ""}`}>{STATUS_LABELS[v] || v}</span> },
          ]}
          data={purchasedLands} onEdit={setEditing} onDelete={handleDelete}
          searchableColumns={["plotName", "plotNumber"]} getRowKey={p => p.id}
        />
      </Card>

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Purchased Land</DialogTitle></DialogHeader>
            <PurchasedLandForm initialValues={editing} onSubmit={d => { updatePurchasedLand(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
