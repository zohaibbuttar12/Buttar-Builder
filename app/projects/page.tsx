"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddProjectDialog } from "@/components/dialogs/AddProjectDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProjectForm } from "@/components/forms/ProjectForm"
import { Project } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

const statusColor: Record<string,string> = { active:"bg-green-100 text-green-800", completed:"bg-blue-100 text-blue-800", "on-hold":"bg-yellow-100 text-yellow-800", planning:"bg-gray-100 text-gray-800" }

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useData()
  const [editing, setEditing] = useState<Project|null>(null)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Projects</h1><p className="text-muted-foreground mt-1">Manage construction projects</p></div>
        <AddProjectDialog onAdd={addProject} />
      </div>
      <Card className="p-6">
        <DataTable
          columns={[
            { key:"name", label:"Project Name", render: (v, r: any) => <Link href={`/projects/${r.id}`} className="text-primary font-medium hover:underline">{v}</Link> },
            { key:"clientName", label:"Client" },
            { key:"location", label:"Location" },
            { key:"plotSize", label:"Plot Size" },
            { key:"startDate", label:"Start Date", render: v => formatDate(v) },
            { key:"estimatedBudget", label:"Budget", render: v => formatCurrency(v) },
            { key:"status", label:"Status", render: v => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[v]||"bg-gray-100 text-gray-800"}`}>{v}</span> },
          ]}
          data={projects} onEdit={setEditing} onDelete={deleteProject}
          searchableColumns={["name","clientName","location"]} getRowKey={p => p.id}
        />
      </Card>
      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
            <ProjectForm initialValues={editing} onSubmit={d => { updateProject(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
