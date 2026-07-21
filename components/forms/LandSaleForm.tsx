"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LandSale, PurchasedLand } from "@/lib/types"

export function LandSaleForm({
  purchasedLands, onError, onSubmit,
}: {
  purchasedLands: PurchasedLand[]
  onError: (e: string | null) => void
  onSubmit: (d: Omit<LandSale,"id"|"constructionStatus">) => void
}) {
  const [selectedLand, setSelectedLand] = useState<string>("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [areaSold, setAreaSold] = useState<number>(0)
  const [salePrice, setSalePrice] = useState<number>(0)
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0])
  const [paymentMode, setPaymentMode] = useState("cash")
  const [notes, setNotes] = useState("")

  const selected = purchasedLands.find(p => p.id === selectedLand)
  const maxArea = selected?.availableArea || 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onError(null)

    if (!selectedLand) { onError("Please select a plot"); return }
    if (areaSold <= 0) { onError("Area sold must be greater than 0"); return }
    if (areaSold > maxArea) { onError(`Area sold cannot exceed available area (${maxArea} ${selected?.unit})`); return }
    if (!customerName) { onError("Customer name is required"); return }
    if (salePrice <= 0) { onError("Sale price must be greater than 0"); return }

    onSubmit({
      purchasedLandId: selectedLand,
      customerName,
      customerPhone,
      areaSold,
      unit: selected?.unit || "marla",
      salePrice: Number(salePrice),
      saleDate,
      paymentMode: paymentMode as any,
      notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Select Plot *</Label>
        <Select value={selectedLand} onValueChange={setSelectedLand}>
          <SelectTrigger><SelectValue placeholder="Choose a purchased plot" /></SelectTrigger>
          <SelectContent>
            {purchasedLands.filter(p => (p.availableArea || 0) > 0).map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.plotName} — Available: {p.availableArea} {p.unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selected && (
        <div className="border rounded-lg p-3 bg-muted/40 text-sm">
          <p className="text-muted-foreground">Plot Details</p>
          <p className="font-medium mt-1">{selected.plotName}</p>
          <p className="text-xs text-muted-foreground mt-1">Available Area: {selected.availableArea} {selected.unit}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Customer Name *</Label><Input value={customerName} onChange={e => setCustomerName(e.target.value)} required /></div>
        <div className="space-y-1"><Label>Customer Phone</Label><Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Area Sold ({selected?.unit}) *</Label><Input type="number" step={0.01} min={0} max={maxArea} value={areaSold} onChange={e => setAreaSold(Number(e.target.value))} required /></div>
        <div className="space-y-1"><Label>Sale Price (PKR) *</Label><Input type="number" min={0} value={salePrice} onChange={e => setSalePrice(Number(e.target.value))} required /></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Sale Date</Label><Input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} /></div>
        <div className="space-y-1">
          <Label>Payment Mode</Label>
          <Select value={paymentMode} onValueChange={setPaymentMode}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="installment">Installment</SelectItem>
              <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
      <Button type="submit" className="w-full">Record Land Sale</Button>
    </form>
  )
}

export function EditLandSaleForm({
  landSale, onSubmit,
}: {
  landSale: LandSale
  onSubmit: (d: Partial<LandSale>) => void
}) {
  const [customerName, setCustomerName] = useState(landSale.customerName)
  const [customerPhone, setCustomerPhone] = useState(landSale.customerPhone || "")
  const [salePrice, setSalePrice] = useState(landSale.salePrice)
  const [saleDate, setSaleDate] = useState(landSale.saleDate)
  const [paymentMode, setPaymentMode] = useState<string>(landSale.paymentMode || "cash")
  const [notes, setNotes] = useState(landSale.notes || "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ customerName, customerPhone, salePrice: Number(salePrice), saleDate, paymentMode: paymentMode as any, notes })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-3 bg-muted/40 text-sm">
        <p className="text-muted-foreground">Plot</p>
        <p className="font-medium">{landSale.plotName} — {landSale.areaSold} {landSale.unit}</p>
        <p className="text-xs text-muted-foreground mt-1">Plot and area sold can&apos;t be changed here — delete and re-record the sale if those need to change.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Customer Name *</Label><Input value={customerName} onChange={e => setCustomerName(e.target.value)} required /></div>
        <div className="space-y-1"><Label>Customer Phone</Label><Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Sale Price (PKR) *</Label><Input type="number" min={0} value={salePrice} onChange={e => setSalePrice(Number(e.target.value))} required /></div>
        <div className="space-y-1"><Label>Sale Date</Label><Input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} /></div>
      </div>

      <div className="space-y-1">
        <Label>Payment Mode</Label>
        <Select value={paymentMode} onValueChange={setPaymentMode}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="installment">Installment</SelectItem>
            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  )
}