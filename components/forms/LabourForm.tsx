"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Labour } from "@/lib/types"

export function LabourForm({ onSubmit, initialValues }: { onSubmit: (d: any) => void; initialValues?: Partial<Labour> }) {
  const [f, setF] = useState({ name: initialValues?.name||"", category: initialValues?.category||"laborer", phone: initialValues?.phone||"", address: initialValues?.address||"" })
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(f) }} className="space-y-4">
      <div className="space-y-1"><Label>Worker Name *</Label><Input value={f.name} onChange={e => setF({...f, name: e.target.value})} required /></div>
      <div className="space-y-1"><Label>Category *</Label>
        <Select value={f.category} onValueChange={v => setF({...f, category: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["mason","carpenter","electrician","plumber","painter","laborer","supervisor"].map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label>Phone</Label><Input value={f.phone} onChange={e => setF({...f, phone: e.target.value})} /></div>
      <div className="space-y-1"><Label>Address</Label><Textarea value={f.address} onChange={e => setF({...f, address: e.target.value})} rows={2} /></div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Worker" : "Add Worker"}</Button>
    </form>
  )
}
