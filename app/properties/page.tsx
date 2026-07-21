"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddPropertyDialog } from "@/components/dialogs/AddPropertyDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PropertyForm } from "@/components/forms/PropertyForm"
import { Property } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  "under-construction": "bg-yellow-100 text-yellow-800",
  ready: "bg-blue-100 text-blue-800",
  sold: "bg-gray-100 text-gray-800",
}
const TYPE_COLORS: Record<string, string> = {
  plot: "bg-amber-100 text-amber-800",
  house: "bg-purple-100 text-purple-800",
  apartment: "bg-blue-100 text-blue-800",
  commercial: "bg-red-100 text-red-800",
}
const STAGE_LABELS: Record<string, string> = {
  "not-started": "Not Started", foundation: "Foundation",
  "grey-structure": "Grey Structure", finishing: "Finishing", complete: "Complete"
}

export default function PropertiesPage() {
  const { properties, projects, addProperty, updateProperty, deleteProperty } = useData()
  const [editing, setEditing] = useState<Property | null>(null)
  const [filterProject, setFilterProject] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || "—"

  const filtered = properties
    .filter(p => filterProject === "all" || p.projectId === filterProject)
    .filter(p => filterType === "all" || p.propertyType === filterType)
    .filter(p => filterStatus === "all" || p.status === filterStatus)

  const totalCost = filtered.reduce((s, p) => s + (p.totalCost || 0), 0)
  const soldCount = filtered.filter(p => p.status === "sold").length
  const availableCount = filtered.filter(p => p.status === "available").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties & Plots</h1>
          <p className="text-muted-foreground mt-1">Track plots, houses, apartments & commercial units</p>
        </div>
        <AddPropertyDialog onAdd={addProperty} projects={projects} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Units</p><p className="text-2xl font-bold mt-1">{filtered.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Available</p><p className="text-2xl font-bold mt-1 text-green-600">{availableCount}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Sold</p><p className="text-2xl font-bold mt-1 text-gray-600">{soldCount}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Cost</p><p className="text-xl font-bold mt-1">{formatCurrency(totalCost)}</p></Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="text-sm border rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-sm border rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Types</option>
            <option value="plot">Plot</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="commercial">Commercial</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="under-construction">Under Construction</option>
            <option value="ready">Ready</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </Card>

      <Card className="p-6">
        <DataTable
          columns={[
            { key: "plotNumber", label: "Plot / Unit #" },
            { key: "propertyType", label: "Type", render: v => <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${TYPE_COLORS[v] || ""}`}>{v}</span> },
            { key: "projectId", label: "Project", render: v => getProjectName(v) },
            { key: "landArea", label: "Area", render: (v, r: any) => `${v} ${r.landUnit}` },
            { key: "landPurchasePrice", label: "Land Cost", render: v => formatCurrency(v) },
            { key: "constructionType", label: "Construction", render: v => v === "none" ? "—" : <span className="capitalize">{v?.replace("-", " ")}</span> },
            { key: "totalConstructionCost", label: "Build Cost", render: v => v ? formatCurrency(v) : "—" },
            { key: "totalCost", label: "Total Cost", render: v => <span className="font-semibold">{formatCurrency(v || 0)}</span> },
            { key: "constructionStage", label: "Stage", render: v => <span className="text-xs">{STAGE_LABELS[v] || v}</span> },
            { key: "status", label: "Status", render: v => <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[v] || ""}`}>{v?.replace("-", " ")}</span> },
          ]}
          data={filtered} onEdit={setEditing} onDelete={deleteProperty}
          searchableColumns={["plotNumber"]} getRowKey={p => p.id}
        />
      </Card>

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Property</DialogTitle></DialogHeader>
            <PropertyForm projects={projects} initialValues={editing} onSubmit={d => { updateProperty(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
