"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

export default function PurchasedLandDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { purchasedLands, projectLandAssignments, projects, landSales } = useData()

  const plot = purchasedLands.find(p => p.id === id)
  const assignments = projectLandAssignments.filter(a => a.purchasedLandId === id)
  const sales = landSales.filter(s => s.purchasedLandId === id)

  if (!plot) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/purchased-lands")} className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button>
        <p className="text-muted-foreground">Plot not found.</p>
      </div>
    )
  }

  const usagePercent = plot.totalArea > 0 ? ((plot.usedArea || 0) / plot.totalArea) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.push("/purchased-lands")} className="gap-2 mb-2 -ml-3"><ArrowLeft className="h-4 w-4" />Back to Purchased Lands</Button>
          <h1 className="text-3xl font-bold">{plot.plotName}</h1>
          <p className="text-muted-foreground mt-1">{plot.plotNumber ? `Plot #${plot.plotNumber} · ` : ""}{plot.location || "No location set"}</p>
        </div>
      </div>

      {/* Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-foreground">Owner</p><p className="font-medium">{plot.owner || "—"}</p></div>
          <div><p className="text-muted-foreground">Total Area</p><p className="font-medium">{plot.totalArea} {plot.unit}</p></div>
          <div><p className="text-muted-foreground">Purchase Price</p><p className="font-medium">{formatCurrency(plot.purchasePrice)}</p></div>
          <div><p className="text-muted-foreground">Transfer Fee</p><p className="font-medium">{formatCurrency(plot.transferFee)}</p></div>
          <div><p className="text-muted-foreground">Total Cost</p><p className="font-medium">{formatCurrency(plot.totalCost || 0)}</p></div>
          <div><p className="text-muted-foreground">Cost per {plot.unit}</p><p className="font-medium">{formatCurrency(plot.costPerUnit || 0)}</p></div>
          <div><p className="text-muted-foreground">Purchase Date</p><p className="font-medium">{plot.purchaseDate ? formatDate(plot.purchaseDate) : "—"}</p></div>
          <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{plot.status?.replace("_", " ")}</p></div>
        </div>
        {plot.notes && <p className="text-sm text-muted-foreground mt-4 border-t pt-4">{plot.notes}</p>}
      </Card>

      {/* Area Usage */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Area Usage</h2>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mb-3">
          <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><p className="text-muted-foreground">Used</p><p className="font-semibold">{plot.usedArea || 0} {plot.unit}</p></div>
          <div><p className="text-muted-foreground">Remaining</p><p className="font-semibold text-green-700">{plot.availableArea || 0} {plot.unit}</p></div>
          <div><p className="text-muted-foreground">Utilization</p><p className="font-semibold">{usagePercent.toFixed(1)}%</p></div>
        </div>
      </Card>

      {/* Projects using this plot */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Projects Using This Plot</h2>
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects have been assigned area from this plot yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-muted-foreground">
                  <th className="pb-2 font-medium">Project</th>
                  <th className="pb-2 font-medium">Area Used</th>
                  <th className="pb-2 font-medium">Cost/Unit (locked)</th>
                  <th className="pb-2 font-medium">Land Cost</th>
                  <th className="pb-2 font-medium">Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => {
                  const project = projects.find(p => p.id === a.projectId)
                  return (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2">
                        <Link href={`/projects`} className="text-primary hover:underline font-medium">{project?.name || "Unknown project"}</Link>
                      </td>
                      <td className="py-2">{a.areaUsed} {plot.unit}</td>
                      <td className="py-2">{formatCurrency(a.costPerUnitSnapshot || 0)}</td>
                      <td className="py-2 font-semibold">{formatCurrency(a.landCost || 0)}</td>
                      <td className="py-2">{a.assignedDate ? formatDate(a.assignedDate) : "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Land Sales from this plot */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Land Sales</h2>
        {sales.length === 0 ? (
          <p className="text-sm text-muted-foreground">No portion of this plot has been sold to a customer yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-muted-foreground">
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Area Sold</th>
                  <th className="pb-2 font-medium">Sale Price</th>
                  <th className="pb-2 font-medium">Land Profit</th>
                  <th className="pb-2 font-medium">Sale Date</th>
                  <th className="pb-2 font-medium">Construction</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{s.customerName}</td>
                    <td className="py-2">{s.areaSold} {plot.unit}</td>
                    <td className="py-2">{formatCurrency(s.salePrice)}</td>
                    <td className={`py-2 font-semibold ${(s.landProfit || 0) >= 0 ? "text-green-700" : "text-red-600"}`}>{formatCurrency(s.landProfit || 0)}</td>
                    <td className="py-2">{formatDate(s.saleDate)}</td>
                    <td className="py-2">
                      {s.projectId ? (
                        <Link href={`/projects/${s.projectId}`} className="text-primary hover:underline">View Project</Link>
                      ) : (
                        <span className="text-muted-foreground">Not started</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Documents */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        {plot.documents && plot.documents.length > 0 ? (
          <ul className="space-y-2">
            {plot.documents.map((d, i) => (
              <li key={i}><a href={d.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">{d.name}</a></li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No documents uploaded for this plot yet.</p>
        )}
      </Card>
    </div>
  )
}
