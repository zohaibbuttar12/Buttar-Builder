"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProjectPartnerForm } from "@/components/forms/ProjectPartnerForm"
import { Partner, Project, ProjectPartner } from "@/lib/types"
import { UserPlus } from "lucide-react"
export function AddProjectPartnerDialog({ onAdd, projects, partners }: { onAdd: (d: Omit<ProjectPartner,"id">) => void; projects: Project[]; partners: Partner[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" className="gap-2"><UserPlus className="h-4 w-4" />Assign Partner</Button></DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Assign Partner to Project</DialogTitle></DialogHeader>
        <ProjectPartnerForm projects={projects} partners={partners} onSubmit={d => { onAdd(d); setOpen(false) }} />
      </DialogContent>
    </Dialog>
  )
}
