"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PurchasedLand } from "@/lib/types"

export function AssignLandForm({
  projectId, purchasedLands, onSubmit, onError,
}: {
  projectId: string
  purchasedLands: PurchasedLand[]
  onSubmit: (d: any) => void
  onError?: (msg: string) => void
}) {
  const [plotId, setPlotId] = useState("")
  const [areaUsed, setAreaUsed] = useState(0)
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")

  const selectedPlot = useMemo(() => purchasedLands.find(p => p.id === plotId), [plotId, purchasedLands])
  const landCost = selectedPlot ? (selectedPlot.costPerUnit || 0) * areaUsed : 0
  const availablePlots = purchasedLands.filter(p => (p.availableArea ?? 0) > 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPlot) return
    if (areaUsed <= 0) { onError?.("Area required must be greater than 0."); return }
    if (areaUsed > (selectedPlot.availableArea ?? 0)) {
      onError?.(`Only ${selectedPlot.availableArea} ${selectedPlot.unit} available on ${selectedPlot.plotName}.`)
      return
    }
    onSubmit({ projectId, purchasedLandId: plotId, areaUsed, assignedDate, notes })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Select Purchased Plot *</Label>
        <Select value={plotId} onValueChange={setPlotId}>
          <SelectTrigger><SelectValue placeholder="Choose a plot" /></SelectTrigger>
          <SelectContent>
            {availablePlots.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.plotName} ({p.availableArea} {p.unit} available)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPlot && (
        <div className="border rounded-lg p-4 space-y-2 bg-blue-50/50 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-muted-foreground">Total Area:</span> <span className="font-medium">{selectedPlot.totalArea} {selectedPlot.unit}</span></div>
            <div><span className="text-muted-foreground">Available Area:</span> <span className="font-medium text-green-700">{selectedPlot.availableArea} {selectedPlot.unit}</span></div>
            <div><span className="text-muted-foreground">Used Area:</span> <span className="font-medium">{selectedPlot.usedArea} {selectedPlot.unit}</span></div>
            <div><span className="text-muted-foreground">Cost per {selectedPlot.unit}:</span> <span className="font-medium">PKR {(selectedPlot.costPerUnit || 0).toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
            <div><span className="text-muted-foreground">Purchase Price:</span> <span className="font-medium">PKR {selectedPlot.purchasePrice.toLocaleString()}</span></div>
            <div><span className="text-muted-foreground">Transfer Fee:</span> <span className="font-medium">PKR {selectedPlot.transferFee.toLocaleString()}</span></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Area Required *</Label>
          <Input type="number" min={0} step="0.01" value={areaUsed} onChange={e => setAreaUsed(Number(e.target.value))} required />
        </div>
        <div className="space-y-1"><Label>Assigned Date</Label>
          <Input type="date" value={assignedDate} onChange={e => setAssignedDate(e.target.value)} />
        </div>
      </div>

      {selectedPlot && areaUsed > 0 && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 flex justify-between items-center">
          <span className="text-sm font-semibold text-green-800">Calculated Land Cost</span>
          <span className="text-lg font-bold text-green-700">PKR {landCost.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
        </div>
      )}

      <div className="space-y-1"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
      <Button type="submit" className="w-full" disabled={!plotId}>Assign Land to Project</Button>
    </form>
  )
}
