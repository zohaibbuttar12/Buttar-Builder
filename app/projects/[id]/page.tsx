"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AssignLandDialog } from "@/components/dialogs/AssignLandDialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { projects, purchasedLands, projectLandAssignments, addProjectLandAssignment, deleteProjectLandAssignment, landSales } = useData()

  const project = projects.find(p => p.id === id)
  const assignments = projectLandAssignments.filter(a => a.projectId === id)
  const totalLandCost = assignments.reduce((s, a) => s + (a.landCost || 0), 0)
  const totalAreaUsed = assignments.reduce((s, a) => s + a.areaUsed, 0)

  const linkedLandSale = project?.landSaleId ? landSales.find(s => s.id === project.landSaleId) : undefined
  const originalPlot = linkedLandSale ? purchasedLands.find(p => p.id === linkedLandSale.purchasedLandId) : undefined

  const [costSummary, setCostSummary] = useState<{
    landCost: number; materialCost: number; labourCost: number; otherExpenses: number; finalProjectCost: number
  } | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/project-cost-summary/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(setCostSummary)
      .catch(() => setCostSummary(null))
  }, [id, assignments.length])

  if (!project) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/projects")} className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button>
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    )
  }

  // Construction Cost excludes the land component when this project came from
  // a Land Sale (that land cost/profit is tracked separately below), and
  // falls back to the assignment-based land cost otherwise.
  const constructionCost = linkedLandSale
    ? (costSummary?.materialCost ?? 0) + (costSummary?.labourCost ?? 0) + (costSummary?.otherExpenses ?? 0)
    : (costSummary?.finalProjectCost ?? totalLandCost)
  const constructionRevenue = project.contractAmount || 0
  const constructionProfit = constructionRevenue - constructionCost
  const landProfit = linkedLandSale?.landProfit || 0
  const overallProfit = landProfit + constructionProfit

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.push("/projects")} className="gap-2 mb-2 -ml-3"><ArrowLeft className="h-4 w-4" />Back to Projects</Button>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.clientName} · {project.location}</p>
        </div>
        <AssignLandDialog projectId={project.id} purchasedLands={purchasedLands} onAssign={addProjectLandAssignment} />
      </div>

      {/* Land Sale & Profit (only for projects started from a Land Sale) */}
      {linkedLandSale && (
        <Card className="p-6 border-blue-200 bg-blue-50/30">
          <h2 className="text-lg font-semibold mb-4">Land Sale & Overall Profit</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <p className="text-muted-foreground">Original Purchased Land</p>
              <p className="font-medium">
                {originalPlot ? (
                  <Link href={`/purchased-lands/${originalPlot.id}`} className="text-primary hover:underline">{originalPlot.plotName}</Link>
                ) : (linkedLandSale.plotName || "—")}
              </p>
            </div>
            <div><p className="text-muted-foreground">Original Plot Number</p><p className="font-medium">{linkedLandSale.plotNumber || originalPlot?.plotNumber || "—"}</p></div>
            <div><p className="text-muted-foreground">Original Plot Size</p><p className="font-medium">{originalPlot ? `${originalPlot.totalArea} ${originalPlot.unit}` : "—"}</p></div>
            <div><p className="text-muted-foreground">Area Purchased</p><p className="font-medium">{linkedLandSale.areaSold} {linkedLandSale.unit}</p></div>
            <div><p className="text-muted-foreground">Land Sale Price</p><p className="font-medium">{formatCurrency(linkedLandSale.salePrice)}</p></div>
            <div><p className="text-muted-foreground">Land Purchase Cost</p><p className="font-medium">{formatCurrency(linkedLandSale.landPurchaseCost || 0)}</p></div>
            <div><p className="text-muted-foreground">Profit Earned from Land Sale</p><p className={`font-semibold ${landProfit >= 0 ? "text-green-700" : "text-red-600"}`}>{formatCurrency(landProfit)}</p></div>
            <div><p className="text-muted-foreground">Sale Date</p><p className="font-medium">{formatDate(linkedLandSale.saleDate)}</p></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
            <div><p className="text-muted-foreground">Construction Budget</p><p className="font-medium">{formatCurrency(project.estimatedBudget || 0)}</p></div>
            <div><p className="text-muted-foreground">Construction Cost</p><p className="font-medium">{formatCurrency(constructionCost)}</p></div>
            <div><p className="text-muted-foreground">Construction Revenue</p><p className="font-medium">{formatCurrency(constructionRevenue)}</p></div>
            <div><p className="text-muted-foreground">Construction Profit</p><p className={`font-semibold ${constructionProfit >= 0 ? "text-green-700" : "text-red-600"}`}>{formatCurrency(constructionProfit)}</p></div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-sm font-semibold">Overall Profit (Land Profit + Construction Profit)</span>
            <span className={`text-xl font-bold ${overallProfit >= 0 ? "text-green-700" : "text-red-600"}`}>{formatCurrency(overallProfit)}</span>
          </div>
        </Card>
      )}

      {/* Cost Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Cost Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div><p className="text-xs text-muted-foreground">Land Cost</p><p className="text-lg font-bold mt-1">{formatCurrency(costSummary?.landCost ?? totalLandCost)}</p></div>
          <div><p className="text-xs text-muted-foreground">Material Cost</p><p className="text-lg font-bold mt-1">{formatCurrency(costSummary?.materialCost ?? 0)}</p></div>
          <div><p className="text-xs text-muted-foreground">Labour Cost</p><p className="text-lg font-bold mt-1">{formatCurrency(costSummary?.labourCost ?? 0)}</p></div>
          <div><p className="text-xs text-muted-foreground">Other Expenses</p><p className="text-lg font-bold mt-1">{formatCurrency(costSummary?.otherExpenses ?? 0)}</p></div>
          <div className="border-l pl-4"><p className="text-xs text-muted-foreground">Final Project Cost</p><p className="text-xl font-bold mt-1 text-green-700">{formatCurrency(costSummary?.finalProjectCost ?? totalLandCost)}</p></div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Budget: {formatCurrency(project.estimatedBudget || 0)}
          {project.estimatedBudget ? ` · Remaining: ${formatCurrency((project.estimatedBudget || 0) - (costSummary?.finalProjectCost ?? totalLandCost))}` : ""}
        </div>
      </Card>

      {/* Assigned Land */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Assigned Purchased Land</h2>
          <span className="text-sm text-muted-foreground">Total area used: {totalAreaUsed}</span>
        </div>
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No land assigned to this project yet. Use &quot;Assign Purchased Land&quot; above to allocate area from a purchased plot.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-muted-foreground">
                  <th className="pb-2 font-medium">Plot</th>
                  <th className="pb-2 font-medium">Area Used</th>
                  <th className="pb-2 font-medium">Cost/Unit (locked)</th>
                  <th className="pb-2 font-medium">Land Cost</th>
                  <th className="pb-2 font-medium">Assigned Date</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => {
                  const plot = purchasedLands.find(p => p.id === a.purchasedLandId)
                  return (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{a.plotName || plot?.plotName || "—"}</td>
                      <td className="py-2">{a.areaUsed} {plot?.unit || ""}</td>
                      <td className="py-2">{formatCurrency(a.costPerUnitSnapshot || 0)}</td>
                      <td className="py-2 font-semibold">{formatCurrency(a.landCost || 0)}</td>
                      <td className="py-2">{a.assignedDate ? formatDate(a.assignedDate) : "—"}</td>
                      <td className="py-2 text-right">
                        <Button
                          size="sm" variant="outline"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => { if (confirm("Remove this land assignment? This will free up the area back to the plot.")) deleteProjectLandAssignment(a.id) }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
