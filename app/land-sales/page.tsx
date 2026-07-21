"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddLandSaleDialog } from "@/components/dialogs/AddLandSaleDialog"
import { EditLandSaleDialog } from "@/components/dialogs/EditLandSaleDialog"
import { StartConstructionDialog } from "@/components/dialogs/StartConstructionDialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, Trash2 } from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  no_construction: "bg-gray-100 text-gray-700",
  construction_started: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
}
const STATUS_LABELS: Record<string, string> = {
  no_construction: "No Construction",
  construction_started: "Construction Started",
  in_progress: "In Progress",
  completed: "Completed",
}

export default function LandSalesPage() {
  const { landSales, purchasedLands, addLandSale, updateLandSale, deleteLandSale, startConstructionFromLandSale } = useData()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const totalAreaSold = landSales.reduce((s, x) => s + x.areaSold, 0)
  const totalRevenue = landSales.reduce((s, x) => s + x.salePrice, 0)
  const totalProfit = landSales.reduce((s, x) => s + (x.landProfit || 0), 0)

  async function handleDelete(id: string) {
    setError(null)
    try { await deleteLandSale(id) }
    catch (e: any) { setError(e.message || "Failed to delete land sale.") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Land Sales</h1>
          <p className="text-muted-foreground mt-1">Portions of purchased land sold directly to customers</p>
        </div>
        <AddLandSaleDialog purchasedLands={purchasedLands} onAdd={addLandSale} />
      </div>

      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Sales</p><p className="text-2xl font-bold mt-1">{landSales.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Area Sold</p><p className="text-2xl font-bold mt-1">{totalAreaSold.toLocaleString()}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-xl font-bold mt-1">{formatCurrency(totalRevenue)}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Land Profit</p><p className="text-xl font-bold mt-1 text-green-700">{formatCurrency(totalProfit)}</p></Card>
      </div>

      <Card className="p-6">
        {landSales.length === 0 ? (
          <p className="text-sm text-muted-foreground">No land sales recorded yet. Use &quot;Record Land Sale&quot; to sell part of a purchased plot to a customer.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b bg-muted/50">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Plot</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Area Sold</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Land Portion</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Sale Price</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Land Profit</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Sale Date</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Construction Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {landSales.map(s => {
                  const plot = purchasedLands.find(p => p.id === s.purchasedLandId)
                  const portionPercent = plot ? ((s.areaSold / plot.totalArea) * 100).toFixed(2) : "0"
                  
                  return (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{s.customerName}</p>
                      {s.customerPhone && <p className="text-xs text-muted-foreground">{s.customerPhone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/purchased-lands/${s.purchasedLandId}`} className="text-primary hover:underline font-medium">{s.plotName || "—"}</Link>
                      {s.plotNumber && <p className="text-xs text-muted-foreground">Plot #{s.plotNumber}</p>}
                    </td>
                    <td className="px-4 py-3">{s.areaSold} {s.unit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, parseFloat(portionPercent))}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{portionPercent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(s.salePrice)}</td>
                    <td className={`px-4 py-3 font-semibold ${(s.landProfit || 0) >= 0 ? "text-green-700" : "text-red-600"}`}>{formatCurrency(s.landProfit || 0)}</td>
                    <td className="px-4 py-3">{formatDate(s.saleDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.constructionStatus]}`}>
                        {STATUS_LABELS[s.constructionStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {s.projectId ? (
                          <Button size="sm" variant="outline" className="gap-2" onClick={() => router.push(`/projects/${s.projectId}`)}>
                            <Eye className="h-3.5 w-3.5" />View Project
                          </Button>
                        ) : (
                          <>
                            <EditLandSaleDialog landSale={s} onUpdate={updateLandSale} />
                            <StartConstructionDialog landSale={s} onStart={startConstructionFromLandSale} />
                          </>
                        )}
                        {!s.projectId && (
                          <Button
                            size="sm" variant="outline"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => { if (confirm("Delete this land sale record?")) handleDelete(s.id) }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
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
