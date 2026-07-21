"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MaterialPurchase, Project, Vendor } from "@/lib/types"

export function MaterialPurchaseForm({ onSubmit, initialValues, projects, vendors }: { onSubmit: (d: any) => void; initialValues?: Partial<MaterialPurchase>; projects: Project[]; vendors: Vendor[] }) {
  const [f, setF] = useState({ projectId: initialValues?.projectId||"", vendorId: initialValues?.vendorId||"", vendorName: initialValues?.vendorName||"", materialType: initialValues?.materialType||"", quantity: initialValues?.quantity||0, unit: initialValues?.unit||"kg", rate: initialValues?.rate||0, date: initialValues?.date||new Date().toISOString().split("T")[0] })
  const pickVendor = (id: string) => { const v = vendors.find(x => x.id === id); setF({...f, vendorId: id, vendorName: v?.shopName||""}) }
  const total = f.quantity * f.rate
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({...f, total}) }} className="space-y-4">
      <div className="space-y-1"><Label>Project *</Label>
        <Select value={f.projectId} onValueChange={v => setF({...f, projectId: v})}>
          <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Vendor</Label>
        <Select value={f.vendorId} onValueChange={pickVendor}>
          <SelectTrigger><SelectValue placeholder="Select vendor (optional)" /></SelectTrigger>
          <SelectContent>{vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.shopName}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Material Type *</Label><Input value={f.materialType} onChange={e => setF({...f, materialType: e.target.value})} required placeholder="e.g. Cement, Steel" /></div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1"><Label>Quantity *</Label><Input type="number" min={0} step="0.01" value={f.quantity} onChange={e => setF({...f, quantity: Number(e.target.value)})} required /></div>
        <div className="space-y-1"><Label>Unit</Label>
          <Select value={f.unit} onValueChange={v => setF({...f, unit: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["kg","ton","bag","piece","feet","meter","litre","gallon","box"].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Rate (PKR)</Label><Input type="number" min={0} value={f.rate} onChange={e => setF({...f, rate: Number(e.target.value)})} /></div>
      </div>
      <div className="space-y-1"><Label>Total (PKR)</Label><Input value={total.toLocaleString()} readOnly className="bg-muted font-semibold" /></div>
      <div className="space-y-1"><Label>Date *</Label><Input type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} required /></div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Purchase" : "Add Purchase"}</Button>
    </form>
  )
}
