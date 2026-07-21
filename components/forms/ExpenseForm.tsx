"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Expense, Project } from "@/lib/types"

export function ExpenseForm({ onSubmit, initialValues, projects }: { onSubmit: (d: any) => void; initialValues?: Partial<Expense>; projects: Project[] }) {
  const [f, setF] = useState({ projectId: initialValues?.projectId||"", category: initialValues?.category||"transport", description: initialValues?.description||"", vendorPerson: initialValues?.vendorPerson||"", amount: initialValues?.amount||0, date: initialValues?.date||new Date().toISOString().split("T")[0] })
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({...f, amount: Number(f.amount)}) }} className="space-y-4">
      <div className="space-y-1"><Label>Project *</Label>
        <Select value={f.projectId} onValueChange={v => setF({...f, projectId: v})}>
          <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Category *</Label>
        <Select value={f.category} onValueChange={v => setF({...f, category: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="loading">Loading</SelectItem>
            <SelectItem value="unloading">Unloading</SelectItem>
            <SelectItem value="equipment-rent">Equipment Rental</SelectItem>
            <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Description *</Label><Textarea value={f.description} onChange={e => setF({...f, description: e.target.value})} rows={2} required /></div>
      <div className="space-y-1"><Label>Vendor / Person</Label><Input value={f.vendorPerson} onChange={e => setF({...f, vendorPerson: e.target.value})} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Amount (PKR) *</Label><Input type="number" min={0} value={f.amount} onChange={e => setF({...f, amount: Number(e.target.value)})} required /></div>
        <div className="space-y-1"><Label>Date *</Label><Input type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} required /></div>
      </div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Expense" : "Add Expense"}</Button>
    </form>
  )
}
