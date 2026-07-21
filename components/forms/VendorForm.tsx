"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Vendor } from "@/lib/types"

export function VendorForm({ onSubmit, initialValues }: { onSubmit: (d: any) => void; initialValues?: Partial<Vendor> }) {
  const [f, setF] = useState({ shopName: initialValues?.shopName||"", ownerName: initialValues?.ownerName||"", materialType: initialValues?.materialType||"", phone: initialValues?.phone||"", address: initialValues?.address||"" })
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(f) }} className="space-y-4">
      <div className="space-y-1"><Label>Shop Name *</Label><Input value={f.shopName} onChange={e => setF({...f, shopName: e.target.value})} required /></div>
      <div className="space-y-1"><Label>Owner Name *</Label><Input value={f.ownerName} onChange={e => setF({...f, ownerName: e.target.value})} required /></div>
      <div className="space-y-1"><Label>Material Type</Label><Input placeholder="e.g. Cement, Steel, Bricks" value={f.materialType} onChange={e => setF({...f, materialType: e.target.value})} /></div>
      <div className="space-y-1"><Label>Phone</Label><Input value={f.phone} onChange={e => setF({...f, phone: e.target.value})} /></div>
      <div className="space-y-1"><Label>Address</Label><Textarea value={f.address} onChange={e => setF({...f, address: e.target.value})} rows={2} /></div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Vendor" : "Add Vendor"}</Button>
    </form>
  )
}
