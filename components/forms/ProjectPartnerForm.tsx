"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Partner, Project, ProjectPartner } from "@/lib/types"

export function ProjectPartnerForm({ onSubmit, initialValues, projects, partners }: { onSubmit: (d: any) => void; initialValues?: Partial<ProjectPartner>; projects: Project[]; partners: Partner[] }) {
  const [f, setF] = useState({ projectId: initialValues?.projectId||"", partnerId: initialValues?.partnerId||"", sharePercent: initialValues?.sharePercent||0, investedAmount: initialValues?.investedAmount||0 })
  const pickPartner = (id: string) => { const p = partners.find(x => x.id===id); setF({...f, partnerId: id, investedAmount: f.investedAmount}) }
  return (
    <form onSubmit={e => { e.preventDefault(); const p = partners.find(x => x.id===f.partnerId); onSubmit({...f, partnerName: p?.name||"", sharePercent: Number(f.sharePercent), investedAmount: Number(f.investedAmount)}) }} className="space-y-4">
      <div className="space-y-1"><Label>Project *</Label>
        <Select value={f.projectId} onValueChange={v => setF({...f, projectId: v})}>
          <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Partner *</Label>
        <Select value={f.partnerId} onValueChange={pickPartner}>
          <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
          <SelectContent>{partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Share % *</Label><Input type="number" min={0} max={100} step="0.01" value={f.sharePercent} onChange={e => setF({...f, sharePercent: Number(e.target.value)})} required /></div>
        <div className="space-y-1"><Label>Invested Amount (PKR)</Label><Input type="number" min={0} value={f.investedAmount} onChange={e => setF({...f, investedAmount: Number(e.target.value)})} /></div>
      </div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update" : "Add Partner to Project"}</Button>
    </form>
  )
}
