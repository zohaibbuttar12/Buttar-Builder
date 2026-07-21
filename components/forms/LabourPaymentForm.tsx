"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Labour, LabourPayment, Project } from "@/lib/types"

export function LabourPaymentForm({ onSubmit, initialValues, projects, labours }: { onSubmit: (d: any) => void; initialValues?: Partial<LabourPayment>; projects: Project[]; labours: Labour[] }) {
  const [f, setF] = useState({ labourId: initialValues?.labourId||"", labourName: initialValues?.labourName||"", projectId: initialValues?.projectId||"", workDescription: initialValues?.workDescription||"", amount: initialValues?.amount||0, date: initialValues?.date||new Date().toISOString().split("T")[0] })
  const pickLabour = (id: string) => { const l = labours.find(x => x.id === id); setF({...f, labourId: id, labourName: l?.name||""}) }
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({...f, amount: Number(f.amount)}) }} className="space-y-4">
      <div className="space-y-1"><Label>Worker *</Label>
        <Select value={f.labourId} onValueChange={pickLabour}>
          <SelectTrigger><SelectValue placeholder="Select worker" /></SelectTrigger>
          <SelectContent>{labours.map(l => <SelectItem key={l.id} value={l.id}>{l.name} ({l.category})</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Project *</Label>
        <Select value={f.projectId} onValueChange={v => setF({...f, projectId: v})}>
          <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Work Description *</Label><Textarea value={f.workDescription} onChange={e => setF({...f, workDescription: e.target.value})} rows={2} required /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Amount (PKR) *</Label><Input type="number" value={f.amount} onChange={e => setF({...f, amount: Number(e.target.value)})} min={0} required /></div>
        <div className="space-y-1"><Label>Date *</Label><Input type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} required /></div>
      </div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Payment" : "Add Payment"}</Button>
    </form>
  )
}
