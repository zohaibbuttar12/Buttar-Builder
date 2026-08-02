"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Project } from "@/lib/types"

const buildProjectForm = (initialValues?: Partial<Project>) => ({
  name: initialValues?.name || "",
  description: initialValues?.description || "",
  clientName: initialValues?.clientName || "",
  clientContact: initialValues?.clientContact || "",
  location: initialValues?.location || "",
  startDate: initialValues?.startDate || "",
  endDate: initialValues?.endDate || "",
  estimatedBudget: initialValues?.estimatedBudget || 0,
  plotSize: initialValues?.plotSize || "",
  status: initialValues?.status || "planning",
  contractAmount: initialValues?.contractAmount || 0,
})

export function ProjectForm({ onSubmit, initialValues }: { onSubmit: (d: any) => void; initialValues?: Partial<Project> }) {
  const [f, setF] = useState(() => buildProjectForm(initialValues))

  useEffect(() => {
    setF(buildProjectForm(initialValues))
  }, [initialValues])

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...f, estimatedBudget: Number(f.estimatedBudget), contractAmount: Number(f.contractAmount) }) }} className="space-y-4">
      <div className="space-y-1"><Label>Project Name *</Label><Input value={f.name} onChange={e => setF({...f, name: e.target.value})} required /></div>
      <div className="space-y-1"><Label>Description</Label><Textarea value={f.description} onChange={e => setF({...f, description: e.target.value})} rows={2} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Client Name *</Label><Input value={f.clientName} onChange={e => setF({...f, clientName: e.target.value})} required /></div>
        <div className="space-y-1"><Label>Client Contact</Label><Input value={f.clientContact} onChange={e => setF({...f, clientContact: e.target.value})} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Location</Label><Input value={f.location} onChange={e => setF({...f, location: e.target.value})} /></div>
        <div className="space-y-1"><Label>Plot Size</Label><Input value={f.plotSize} onChange={e => setF({...f, plotSize: e.target.value})} placeholder="5 Marla, 10 Marla, 1 Kanal" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Start Date *</Label><Input type="date" value={f.startDate} onChange={e => setF({...f, startDate: e.target.value})} required /></div>
        <div className="space-y-1"><Label>End Date</Label><Input type="date" value={f.endDate} onChange={e => setF({...f, endDate: e.target.value})} /></div>
      </div>
      <div className="space-y-1"><Label>Budget (PKR) *</Label><Input type="number" value={f.estimatedBudget} onChange={e => setF({...f, estimatedBudget: Number(e.target.value)})} min={0} required /></div>
      <div className="space-y-1"><Label>Status</Label>
        <Select value={f.status} onValueChange={v => setF({...f, status: v as any})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Project" : "Add Project"}</Button>
    </form>
  )
}
