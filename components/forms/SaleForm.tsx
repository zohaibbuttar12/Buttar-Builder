"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sale, Project, Property } from "@/lib/types"

const buildSaleForm = (initialValues?: Partial<Sale>) => ({
  projectId: initialValues?.projectId || "",
  propertyId: initialValues?.propertyId || "",
  salePrice: initialValues?.salePrice || 0,
  saleDate: initialValues?.saleDate || new Date().toISOString().split("T")[0],
  buyerName: initialValues?.buyerName || "",
  buyerPhone: initialValues?.buyerPhone || "",
  paymentMode: initialValues?.paymentMode || "cash",
  notes: initialValues?.notes || "",
})

export function SaleForm({ onSubmit, initialValues, projects, properties }: { onSubmit: (d: any) => void; initialValues?: Partial<Sale>; projects: Project[]; properties: Property[] }) {
  const [f, setF] = useState(() => buildSaleForm(initialValues))

  useEffect(() => {
    setF(buildSaleForm(initialValues))
  }, [initialValues])

  const availableProps = properties.filter(p => p.projectId===f.projectId && (p.status==="available"||p.status==="ready"||p.id===initialValues?.propertyId))
  const selectedProp = properties.find(p => p.id===f.propertyId)
  const profit = selectedProp ? f.salePrice - (selectedProp.totalCost||0) : 0
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({...f, salePrice: Number(f.salePrice)}) }} className="space-y-4">
      <div className="space-y-1"><Label>Project *</Label>
        <Select value={f.projectId} onValueChange={v => setF({...f, projectId: v, propertyId: ""})}>
          <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Property / Unit *</Label>
        <Select value={f.propertyId} onValueChange={v => setF({...f, propertyId: v})}>
          <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
          <SelectContent>{availableProps.map(p => <SelectItem key={p.id} value={p.id}>{p.propertyType.toUpperCase()} — {p.plotNumber} (Cost: PKR {(p.totalCost||0).toLocaleString()})</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Sale Price (PKR) *</Label><Input type="number" min={0} value={f.salePrice} onChange={e => setF({...f, salePrice: Number(e.target.value)})} required /></div>
        <div className="space-y-1"><Label>Sale Date *</Label><Input type="date" value={f.saleDate} onChange={e => setF({...f, saleDate: e.target.value})} required /></div>
      </div>
      {selectedProp && (
        <div className={`rounded-lg p-3 border text-sm font-medium ${profit>=0 ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          Property Cost: PKR {(selectedProp.totalCost||0).toLocaleString()} &nbsp;|&nbsp; Estimated Profit: PKR {profit.toLocaleString()}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Buyer Name *</Label><Input value={f.buyerName} onChange={e => setF({...f, buyerName: e.target.value})} required /></div>
        <div className="space-y-1"><Label>Buyer Phone</Label><Input value={f.buyerPhone} onChange={e => setF({...f, buyerPhone: e.target.value})} /></div>
      </div>
      <div className="space-y-1"><Label>Payment Mode</Label>
        <Select value={f.paymentMode} onValueChange={v => setF({...f, paymentMode: v as any})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
            <SelectItem value="installment">Installment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Notes</Label><Textarea value={f.notes} onChange={e => setF({...f, notes: e.target.value})} rows={2} /></div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Sale" : "Record Sale"}</Button>
    </form>
  )
}
