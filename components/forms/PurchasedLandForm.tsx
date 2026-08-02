"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PurchasedLand } from "@/lib/types"

const buildPurchasedLandForm = (initialValues?: Partial<PurchasedLand>) => ({
  plotName: initialValues?.plotName || "",
  plotNumber: initialValues?.plotNumber || "",
  location: initialValues?.location || "",
  owner: initialValues?.owner || "",
  totalArea: initialValues?.totalArea || 0,
  unit: initialValues?.unit || "marla",
  purchasePrice: initialValues?.purchasePrice || 0,
  transferFee: initialValues?.transferFee || 0,
  purchaseDate: initialValues?.purchaseDate || new Date().toISOString().split("T")[0],
  notes: initialValues?.notes || "",
})

export function PurchasedLandForm({ onSubmit, initialValues }: { onSubmit: (d: any) => void; initialValues?: Partial<PurchasedLand> }) {
  const [f, setF] = useState(() => buildPurchasedLandForm(initialValues))

  useEffect(() => {
    setF(buildPurchasedLandForm(initialValues))
  }, [initialValues])

  const totalCost = (f.purchasePrice || 0) + (f.transferFee || 0)
  const costPerUnit = f.totalArea > 0 ? totalCost / f.totalArea : 0

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Plot Name *</Label><Input value={f.plotName} onChange={e => setF({...f, plotName: e.target.value})} required /></div>
        <div className="space-y-1"><Label>Plot Number</Label><Input value={f.plotNumber} onChange={e => setF({...f, plotNumber: e.target.value})} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Location</Label><Input value={f.location} onChange={e => setF({...f, location: e.target.value})} /></div>
        <div className="space-y-1"><Label>Owner (Seller)</Label><Input value={f.owner} onChange={e => setF({...f, owner: e.target.value})} /></div>
      </div>

      <div className="border rounded-lg p-4 space-y-3 bg-blue-50/50">
        <p className="text-sm font-semibold text-blue-700">Land Details</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1"><Label>Total Area *</Label><Input type="number" min={0} step="0.01" value={f.totalArea} onChange={e => setF({...f, totalArea: Number(e.target.value)})} required /></div>
          <div className="space-y-1"><Label>Unit</Label>
            <Select value={f.unit} onValueChange={v => setF({...f, unit: v as any})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="marla">Marla</SelectItem>
                <SelectItem value="kanal">Kanal</SelectItem>
                <SelectItem value="sqft">Sq Ft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Purchase Date</Label><Input type="date" value={f.purchaseDate} onChange={e => setF({...f, purchaseDate: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1"><Label>Purchase Price (PKR) *</Label><Input type="number" min={0} value={f.purchasePrice} onChange={e => setF({...f, purchasePrice: Number(e.target.value)})} required /></div>
          <div className="space-y-1"><Label>Transfer Fee (PKR)</Label><Input type="number" min={0} value={f.transferFee} onChange={e => setF({...f, transferFee: Number(e.target.value)})} /></div>
        </div>
      </div>

      <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-green-800">Total Cost</span>
          <span className="text-lg font-bold text-green-700">PKR {totalCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-green-700">Cost per {f.unit}</span>
          <span className="text-sm font-semibold text-green-700">PKR {costPerUnit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      <div className="space-y-1"><Label>Notes</Label><Textarea value={f.notes} onChange={e => setF({...f, notes: e.target.value})} rows={2} /></div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Plot" : "Add Purchased Land"}</Button>
    </form>
  )
}
