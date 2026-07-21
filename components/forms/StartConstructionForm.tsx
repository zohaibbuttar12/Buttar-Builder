"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LandSale } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export function StartConstructionForm({
  landSale, onSubmit,
}: {
  landSale: LandSale
  onSubmit: (d: any) => void
}) {
  const [name, setName] = useState(`${landSale.customerName} - House Construction`)
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState("")
  const [estimatedBudget, setEstimatedBudget] = useState(0)
  const [contractAmount, setContractAmount] = useState(0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name, description,
      clientName: landSale.customerName,
      clientContact: landSale.customerPhone || "",
      location: landSale.plotLocation || "",
      plotSize: `${landSale.areaSold} ${landSale.unit}`,
      startDate, endDate: endDate || undefined,
      estimatedBudget: Number(estimatedBudget),
      contractAmount: Number(contractAmount),
      status: "planning",
      purchasedLandId: landSale.purchasedLandId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4 space-y-2 bg-blue-50/50 text-sm">
        <p className="text-sm font-semibold text-blue-700 mb-1">Carried forward from Land Sale</p>
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{landSale.customerName}</span></div>
          <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{landSale.customerPhone || "—"}</span></div>
          <div><span className="text-muted-foreground">Plot:</span> <span className="font-medium">{landSale.plotName || "—"} {landSale.plotNumber ? `(#${landSale.plotNumber})` : ""}</span></div>
          <div><span className="text-muted-foreground">Area Purchased:</span> <span className="font-medium">{landSale.areaSold} {landSale.unit}</span></div>
          <div><span className="text-muted-foreground">Land Sale Price:</span> <span className="font-medium">{formatCurrency(landSale.salePrice)}</span></div>
          <div><span className="text-muted-foreground">Sale Date:</span> <span className="font-medium">{landSale.saleDate}</span></div>
        </div>
      </div>

      <div className="space-y-1"><Label>Project Name *</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
      <div className="space-y-1"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} /></div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Start Date *</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required /></div>
        <div className="space-y-1"><Label>Est. End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Construction Budget (PKR) *</Label>
          <Input type="number" min={0} value={estimatedBudget} onChange={e => setEstimatedBudget(Number(e.target.value))} required />
        </div>
        <div className="space-y-1"><Label>Construction Contract / Revenue (PKR)</Label>
          <Input type="number" min={0} value={contractAmount} onChange={e => setContractAmount(Number(e.target.value))} />
        </div>
      </div>

      <Button type="submit" className="w-full">Create Construction Project</Button>
    </form>
  )
}
