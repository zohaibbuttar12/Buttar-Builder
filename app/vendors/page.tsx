"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddVendorDialog } from "@/components/dialogs/AddVendorDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VendorForm } from "@/components/forms/VendorForm"
import { Vendor } from "@/lib/types"

export default function VendorsPage() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useData()
  const [editing, setEditing] = useState<Vendor|null>(null)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Vendors & Shops</h1><p className="text-muted-foreground mt-1">Manage suppliers</p></div>
        <AddVendorDialog onAdd={addVendor} />
      </div>
      <Card className="p-6">
        <DataTable
          columns={[
            { key:"shopName", label:"Shop Name" },
            { key:"ownerName", label:"Owner" },
            { key:"materialType", label:"Material Type" },
            { key:"phone", label:"Phone" },
            { key:"address", label:"Address" },
          ]}
          data={vendors} onEdit={setEditing} onDelete={deleteVendor}
          searchableColumns={["shopName","ownerName","materialType"]} getRowKey={v => v.id}
        />
      </Card>
      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Edit Vendor</DialogTitle></DialogHeader>
            <VendorForm initialValues={editing} onSubmit={d => { updateVendor(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
