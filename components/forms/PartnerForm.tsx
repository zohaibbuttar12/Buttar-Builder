"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Partner } from "@/lib/types"

const buildPartnerForm = (initialValues?: Partial<Partner>) => ({
  name: initialValues?.name || "",
  phone: initialValues?.phone || "",
  email: initialValues?.email || "",
  cnic: initialValues?.cnic || "",
  address: initialValues?.address || "",
  notes: initialValues?.notes || "",
})

export function PartnerForm({ onSubmit, initialValues }: { onSubmit: (d: any) => void; initialValues?: Partial<Partner> }) {
  const [f, setF] = useState(() => buildPartnerForm(initialValues))

  useEffect(() => {
    setF(buildPartnerForm(initialValues))
  }, [initialValues])

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(f) }} className="space-y-4">
      <div className="space-y-1"><Label>Partner Name *</Label><Input value={f.name} onChange={e => setF({...f, name: e.target.value})} required /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Phone *</Label><Input value={f.phone} onChange={e => setF({...f, phone: e.target.value})} required /></div>
        <div className="space-y-1"><Label>Email</Label><Input type="email" value={f.email} onChange={e => setF({...f, email: e.target.value})} /></div>
      </div>
      <div className="space-y-1"><Label>CNIC</Label><Input placeholder="XXXXX-XXXXXXX-X" value={f.cnic} onChange={e => setF({...f, cnic: e.target.value})} /></div>
      <div className="space-y-1"><Label>Address</Label><Textarea value={f.address} onChange={e => setF({...f, address: e.target.value})} rows={2} /></div>
      <div className="space-y-1"><Label>Notes</Label><Textarea value={f.notes} onChange={e => setF({...f, notes: e.target.value})} rows={2} /></div>
      <Button type="submit" className="w-full">{initialValues?.id ? "Update Partner" : "Add Partner"}</Button>
    </form>
  )
}
