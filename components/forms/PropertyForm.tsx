"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Property, Project } from "@/lib/types"

const buildPropertyForm = (initialValues?: Partial<Property>) => ({
  projectId: initialValues?.projectId || "",
  plotNumber: initialValues?.plotNumber || "",
  propertyType: initialValues?.propertyType || "plot",
  landArea: initialValues?.landArea || 0,
  landUnit: initialValues?.landUnit || "marla",
  landPurchasePrice: initialValues?.landPurchasePrice || 0,
  transferFees: initialValues?.transferFees || 0,
  purchaseDate: initialValues?.purchaseDate || new Date().toISOString().split("T")[0],
  constructionType: initialValues?.constructionType || "none",
  constructionArea: initialValues?.constructionArea || 0,
  constructionCostPerSqFt: initialValues?.constructionCostPerSqFt || 0,
  constructionStage: initialValues?.constructionStage || "not-started",
  status: initialValues?.status || "available",
  notes: initialValues?.notes || "",
})

export function PropertyForm({ onSubmit, initialValues, projects }: { onSubmit: (d: any) => void; initialValues?: Partial<Property>; projects: Project[] }) {
  const [f, setF] = useState(() => buildPropertyForm(initialValues))

  useEffect(() => {
    setF(buildPropertyForm(initialValues))
  }, [initialValues])

  const constTotal = (f.constructionArea || 0) * (f.constructionCostPerSqFt || 0)
  const totalCost = (f.landPurchasePrice||0) + (f.transferFees||0) + constTotal
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({...f, totalConstructionCost: constTotal, totalCost}) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Project *</Label>
          <Select value={f.projectId} onValueChange={v => setF({...f, projectId: v})}>
            <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
            <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Plot / Unit Number *</Label><Input value={f.plotNumber} onChange={e => setF({...f, plotNumber: e.target.value})} required /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Property Type *</Label>
          <Select value={f.propertyType} onValueChange={v => setF({...f, propertyType: v as any})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="plot">Plot</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Status</Label>
          <Select value={f.status} onValueChange={v => setF({...f, status: v as any})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="under-construction">Under Construction</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="border rounded-lg p-4 space-y-3 bg-blue-50/50">
        <p className="text-sm font-semibold text-blue-700">Land Details</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1"><Label>Area *</Label><Input type="number" min={0} step="0.01" value={f.landArea} onChange={e => setF({...f, landArea: Number(e.target.value)})} required /></div>
          <div className="space-y-1"><Label>Unit</Label>
            <Select value={f.landUnit} onValueChange={v => setF({...f, landUnit: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="marla">Marla</SelectItem>
                <SelectItem value="kanal">Kanal</SelectItem>
                <SelectItem value="sq-yards">Sq Yards</SelectItem>
                <SelectItem value="sq-ft">Sq Ft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Purchase Date</Label><Input type="date" value={f.purchaseDate} onChange={e => setF({...f, purchaseDate: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1"><Label>Purchase Price (PKR)</Label><Input type="number" min={0} value={f.landPurchasePrice} onChange={e => setF({...f, landPurchasePrice: Number(e.target.value)})} /></div>
          <div className="space-y-1"><Label>Transfer Fees (PKR)</Label><Input type="number" min={0} value={f.transferFees} onChange={e => setF({...f, transferFees: Number(e.target.value)})} /></div>
        </div>
      </div>
      <div className="border rounded-lg p-4 space-y-3 bg-orange-50/50">
        <p className="text-sm font-semibold text-orange-700">Construction Details</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1"><Label>Construction Type</Label>
            <Select value={f.constructionType} onValueChange={v => setF({...f, constructionType: v as any})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Plot Only)</SelectItem>
                <SelectItem value="grey-structure">Grey Structure</SelectItem>
                <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Stage</Label>
            <Select value={f.constructionStage} onValueChange={v => setF({...f, constructionStage: v as any})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="foundation">Foundation</SelectItem>
                <SelectItem value="grey-structure">Grey Structure</SelectItem>
                <SelectItem value="finishing">Finishing</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {f.constructionType !== "none" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1"><Label>Area (Sq Ft)</Label><Input type="number" min={0} value={f.constructionArea} onChange={e => setF({...f, constructionArea: Number(e.target.value)})} /></div>
            <div className="space-y-1"><Label>Rate per Sq Ft (PKR)</Label><Input type="number" min={0} value={f.constructionCostPerSqFt} onChange={e => setF({...f, constructionCostPerSqFt: Number(e.target.value)})} /></div>
          </div>
        )}
        {f.constructionType !== "none" && constTotal > 0 && (
          <p className="text-xs text-orange-700 font-medium">Construction Cost: PKR {constTotal.toLocaleString()}</p>
        )}
      </div>
      <div className="rounded-lg bg-green-50 border border-green-200 p-3 flex justify-between items-center">
        <span className="text-sm font-semibold text-green-800">Total Property Cost</span>
        <span className="text-lg font-bold text-green-700">PKR {totalCost.toLocaleString()}</span>
      </div>
      <div className="space-y-1"><Label>Notes</Label><Textarea value={f.notes} onChange={e => setF({...f, notes: e.target.value})} rows={2} /></div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Property" : "Add Property"}</Button>
    </form>
  )
}
