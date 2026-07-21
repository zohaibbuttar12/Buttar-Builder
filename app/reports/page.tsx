"use client"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default function ReportsPage() {
  const { projects, labourPayments, materialPurchases, expenses, landSales } = useData()

  // ─── Company Profit: Land Profit + Construction Profit, separately and together ───
  const totalLandProfit = landSales.reduce((s, x) => s + (x.landProfit || 0), 0)
  const totalLandSalePrice = landSales.reduce((s, x) => s + x.salePrice, 0)
  const totalLandPurchaseCost = landSales.reduce((s, x) => s + (x.landPurchaseCost || 0), 0)

  const linkedProjects = projects.filter(p => p.landSaleId)
  const constructionRows = linkedProjects.map(p => {
    const labour = labourPayments.filter(x => x.projectId === p.id).reduce((s, x) => s + x.amount, 0)
    const material = materialPurchases.filter(x => x.projectId === p.id).reduce((s, x) => s + x.total, 0)
    const exp = expenses.filter(x => x.projectId === p.id).reduce((s, x) => s + x.amount, 0)
    const constructionCost = labour + material + exp
    const constructionRevenue = p.contractAmount || 0
    const constructionProfit = constructionRevenue - constructionCost
    const landSale = landSales.find(s => s.id === p.landSaleId)
    const landProfit = landSale?.landProfit || 0
    return {
      project: p, customer: p.clientName, constructionCost, constructionRevenue, constructionProfit,
      landProfit, overallProfit: landProfit + constructionProfit,
    }
  })
  const totalConstructionCost = constructionRows.reduce((s, r) => s + r.constructionCost, 0)
  const totalConstructionRevenue = constructionRows.reduce((s, r) => s + r.constructionRevenue, 0)
  const totalConstructionProfit = constructionRows.reduce((s, r) => s + r.constructionProfit, 0)
  const overallCompanyProfit = totalLandProfit + totalConstructionProfit

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      {/* Company Profit */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Company Profit</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 bg-blue-50/50">
            <p className="text-xs text-muted-foreground mb-2">Land Sales</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Purchase Cost</span><span className="font-medium">{formatCurrency(totalLandPurchaseCost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Selling Price</span><span className="font-medium">{formatCurrency(totalLandSalePrice)}</span></div>
              <div className="flex justify-between border-t pt-1 mt-1"><span className="font-semibold">Land Profit</span><span className="font-bold text-green-700">{formatCurrency(totalLandProfit)}</span></div>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-purple-50/50">
            <p className="text-xs text-muted-foreground mb-2">Construction (linked to Land Sales)</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Construction Cost</span><span className="font-medium">{formatCurrency(totalConstructionCost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Construction Contract</span><span className="font-medium">{formatCurrency(totalConstructionRevenue)}</span></div>
              <div className="flex justify-between border-t pt-1 mt-1"><span className="font-semibold">Construction Profit</span><span className="font-bold text-green-700">{formatCurrency(totalConstructionProfit)}</span></div>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-green-50 flex flex-col justify-center items-center text-center">
            <p className="text-xs text-muted-foreground mb-2">Overall Customer Profit</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(overallCompanyProfit)}</p>
            <p className="text-xs text-muted-foreground mt-1">Land Profit + Construction Profit</p>
          </div>
        </div>

        {constructionRows.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-muted-foreground">
                  <th className="pb-2 font-medium">Customer / Project</th>
                  <th className="pb-2 font-medium">Land Profit</th>
                  <th className="pb-2 font-medium">Construction Cost</th>
                  <th className="pb-2 font-medium">Construction Contract</th>
                  <th className="pb-2 font-medium">Construction Profit</th>
                  <th className="pb-2 font-medium">Overall Profit</th>
                </tr>
              </thead>
              <tbody>
                {constructionRows.map(r => (
                  <tr key={r.project.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{r.customer} <span className="text-muted-foreground">({r.project.name})</span></td>
                    <td className="py-2 text-green-700">{formatCurrency(r.landProfit)}</td>
                    <td className="py-2">{formatCurrency(r.constructionCost)}</td>
                    <td className="py-2">{formatCurrency(r.constructionRevenue)}</td>
                    <td className="py-2 text-green-700">{formatCurrency(r.constructionProfit)}</td>
                    <td className="py-2 font-bold">{formatCurrency(r.overallProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {landSales.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">No land sales recorded yet — profit breakdown will appear here once you record land sales.</p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {projects.map(p => {
          const labour = labourPayments.filter(x => x.projectId === p.id).reduce((s,x) => s+x.amount, 0)
          const material = materialPurchases.filter(x => x.projectId === p.id).reduce((s,x) => s+x.total, 0)
          const exp = expenses.filter(x => x.projectId === p.id).reduce((s,x) => s+x.amount, 0)
          const spent = labour + material + exp
          const pct = p.estimatedBudget > 0 ? Math.min(100, Math.round(spent/p.estimatedBudget*100)) : 0
          return (
            <Card key={p.id} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status==="active"?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}`}>{p.status}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                <div><p className="text-muted-foreground">Budget</p><p className="font-semibold">{formatCurrency(p.estimatedBudget)}</p></div>
                <div><p className="text-muted-foreground">Labour</p><p className="font-semibold">{formatCurrency(labour)}</p></div>
                <div><p className="text-muted-foreground">Material</p><p className="font-semibold">{formatCurrency(material)}</p></div>
                <div><p className="text-muted-foreground">Other</p><p className="font-semibold">{formatCurrency(exp)}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full ${pct>=90?"bg-red-500":pct>=70?"bg-yellow-500":"bg-green-500"}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-medium">{pct}% used</span>
                <span className="text-sm text-muted-foreground">({formatCurrency(p.estimatedBudget - spent)} remaining)</span>
              </div>
            </Card>
          )
        })}
        {projects.length === 0 && <p className="text-muted-foreground text-center py-12">No projects yet. Add a project to see reports.</p>}
      </div>
    </div>
  )
}
