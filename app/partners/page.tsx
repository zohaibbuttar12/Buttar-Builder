"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddPartnerDialog } from "@/components/dialogs/AddPartnerDialog"
import { AddProjectPartnerDialog } from "@/components/dialogs/AddProjectPartnerDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PartnerForm } from "@/components/forms/PartnerForm"
import { Partner } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { Users, TrendingUp } from "lucide-react"

export default function PartnersPage() {
  const { partners, projectPartners, projects, sales, properties, addPartner, updatePartner, deletePartner, addProjectPartner } = useData()
  const [editing, setEditing] = useState<Partner | null>(null)
  const [tab, setTab] = useState<"partners" | "assignments">("partners")

  const getPartnerStats = (partnerId: string) => {
    const assignments = projectPartners.filter(pp => pp.partnerId === partnerId)
    const totalInvested = assignments.reduce((s, a) => s + a.investedAmount, 0)
    const totalProfit = sales.reduce((sum, sale) => {
      const pp = assignments.find(a => a.projectId === sale.projectId)
      if (!pp || !sale.profit) return sum
      return sum + (sale.profit * pp.sharePercent / 100)
    }, 0)
    return { projects: assignments.length, totalInvested, totalProfit }
  }

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || "—"
  const getPartnerName = (id: string) => partners.find(p => p.id === id)?.name || "—"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partners</h1>
          <p className="text-muted-foreground mt-1">Manage investment partners & shareholding</p>
        </div>
        <div className="flex gap-2">
          <AddProjectPartnerDialog onAdd={addProjectPartner} projects={projects} partners={partners} />
          <AddPartnerDialog onAdd={addPartner} />
        </div>
      </div>

      {/* Tab switch */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(["partners","assignments"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${tab===t ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "partners" ? "Partners" : "Project Assignments"}
          </button>
        ))}
      </div>

      {tab === "partners" && (
        <>
          {/* Partner summary cards */}
          {partners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map(p => {
                const stats = getPartnerStats(p.id)
                return (
                  <Card key={p.id} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{stats.projects} project{stats.projects !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="font-semibold text-base">{p.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{p.phone}</p>
                    {p.cnic && <p className="text-xs text-muted-foreground mt-0.5">CNIC: {p.cnic}</p>}
                    <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Invested</p>
                        <p className="text-sm font-semibold">{formatCurrency(stats.totalInvested)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Profit Share</p>
                        <p className={`text-sm font-semibold ${stats.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(stats.totalProfit)}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          <Card className="p-6">
            <h3 className="font-semibold mb-4">All Partners</h3>
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "email", label: "Email", render: v => v || "—" },
                { key: "cnic", label: "CNIC", render: v => v || "—" },
                { key: "address", label: "Address", render: v => v || "—" },
              ]}
              data={partners} onEdit={setEditing} onDelete={deletePartner}
              searchableColumns={["name", "phone", "cnic"]} getRowKey={p => p.id}
            />
          </Card>
        </>
      )}

      {tab === "assignments" && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Partner–Project Assignments</h3>
          <DataTable
            columns={[
              { key: "partnerName", label: "Partner" },
              { key: "projectId", label: "Project", render: v => getProjectName(v) },
              { key: "sharePercent", label: "Share %", render: v => <span className="font-semibold text-primary">{v}%</span> },
              { key: "investedAmount", label: "Invested", render: v => formatCurrency(v) },
            ]}
            data={projectPartners.map(pp => ({ ...pp, partnerName: getPartnerName(pp.partnerId) }))}
            searchableColumns={["partnerName"]} getRowKey={pp => pp.id}
          />
        </Card>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Partner</DialogTitle></DialogHeader>
            <PartnerForm initialValues={editing} onSubmit={d => { updatePartner(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
