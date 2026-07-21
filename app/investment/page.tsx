"use client"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Building2, Users, DollarSign, Landmark, Hammer, ArrowRight } from "lucide-react"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function InvestmentPage() {
  const { projects, properties, sales, partners, projectPartners, labourPayments, materialPurchases, expenses } = useData()

  // ── Global stats ──────────────────────────────────────────
  const totalLand = properties.reduce((s, p) => s + p.landPurchasePrice + p.transferFees, 0)
  const totalConstruction = properties.reduce((s, p) => s + (p.totalConstructionCost || 0), 0)
  const totalLabour = labourPayments.reduce((s, p) => s + p.amount, 0)
  const totalMaterial = materialPurchases.reduce((s, p) => s + p.total, 0)
  const totalOtherExp = expenses.reduce((s, e) => s + e.amount, 0)
  const totalInvested = totalLand + totalConstruction + totalLabour + totalMaterial + totalOtherExp
  const totalRevenue = sales.reduce((s, x) => s + x.salePrice, 0)
  const totalProfit = sales.reduce((s, x) => s + (x.profit || 0), 0)

  // ── Per-project breakdown ─────────────────────────────────
  const projectBreakdown = projects.map(proj => {
    const projProps = properties.filter(p => p.projectId === proj.id)
    const landCost = projProps.reduce((s, p) => s + p.landPurchasePrice + p.transferFees, 0)
    const buildCost = projProps.reduce((s, p) => s + (p.totalConstructionCost || 0), 0)
    const labourCost = labourPayments.filter(x => x.projectId === proj.id).reduce((s, x) => s + x.amount, 0)
    const matCost = materialPurchases.filter(x => x.projectId === proj.id).reduce((s, x) => s + x.total, 0)
    const expCost = expenses.filter(x => x.projectId === proj.id).reduce((s, x) => s + x.amount, 0)
    const totalCost = landCost + buildCost + labourCost + matCost + expCost
    const revenue = sales.filter(x => x.projectId === proj.id).reduce((s, x) => s + x.salePrice, 0)
    const profit = sales.filter(x => x.projectId === proj.id).reduce((s, x) => s + (x.profit || 0), 0)
    const pps = projectPartners.filter(pp => pp.projectId === proj.id)
    return { project: proj, landCost, buildCost, labourCost, matCost, expCost, totalCost, revenue, profit, pps }
  })

  // ── Per-partner summary ───────────────────────────────────
  const partnerSummary = partners.map(partner => {
    const assignments = projectPartners.filter(pp => pp.partnerId === partner.id)
    const invested = assignments.reduce((s, a) => s + a.investedAmount, 0)
    const profitShare = sales.reduce((sum, sale) => {
      const pp = assignments.find(a => a.projectId === sale.projectId)
      if (!pp || !sale.profit) return sum
      return sum + (sale.profit * pp.sharePercent / 100)
    }, 0)
    return { partner, invested, profitShare, assignments }
  })

  // ── Chart data ────────────────────────────────────────────
  const costBreakdownPie = [
    { name: "Land", value: totalLand },
    { name: "Construction", value: totalConstruction },
    { name: "Labour", value: totalLabour },
    { name: "Material", value: totalMaterial },
    { name: "Other", value: totalOtherExp },
  ].filter(x => x.value > 0)

  const projectChartData = projectBreakdown.map(pb => ({
    name: pb.project.name.length > 14 ? pb.project.name.slice(0, 14) + "…" : pb.project.name,
    cost: pb.totalCost,
    revenue: pb.revenue,
    profit: pb.profit,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Investment Dashboard</h1>
        <p className="text-muted-foreground mt-1">Full financial overview: costs, profits & partner distribution</p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Invested", value: formatCurrency(totalInvested), icon: DollarSign, color: "text-blue-600" },
          { label: "Land Cost", value: formatCurrency(totalLand), icon: Landmark, color: "text-amber-600" },
          { label: "Build Cost", value: formatCurrency(totalConstruction), icon: Building2, color: "text-orange-600" },
          { label: "Labour Cost", value: formatCurrency(totalLabour), icon: Hammer, color: "text-purple-600" },
          { label: "Revenue", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-green-600" },
          { label: "Net Profit", value: formatCurrency(totalProfit), icon: TrendingUp, color: totalProfit >= 0 ? "text-green-700" : "text-red-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {(projectChartData.length > 0 || costBreakdownPie.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectChartData.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Cost vs Revenue vs Profit by Project</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={projectChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => "₨" + Math.round(v / 1000) + "K"} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
          {costBreakdownPie.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Investment Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={costBreakdownPie} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {costBreakdownPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}

      {/* Investor table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Investor Portfolio</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Investor</th>
                  <th className="px-4 py-3">Investment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {partnerSummary.map(({ partner, invested }) => (
                  <tr key={partner.id} className="border-t border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{partner.name}</td>
                    <td className="px-4 py-3">{formatCurrency(invested)}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Active</span></td>
                    <td className="px-4 py-3">
                      <Link href={`/investment/${partner.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37]">
                        View Profile <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Per-project cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">Project-wise Breakdown</h2>
        <div className="space-y-4">
          {projectBreakdown.map(pb => {
            const pct = pb.totalCost > 0 ? Math.min(100, Math.round(pb.revenue / pb.totalCost * 100)) : 0
            return (
              <Card key={pb.project.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{pb.project.name}</h3>
                    <p className="text-sm text-muted-foreground">{pb.project.location} &nbsp;·&nbsp; {pb.project.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">{formatCurrency(pb.project.estimatedBudget)}</p>
                  </div>
                </div>

                {/* Cost grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4 text-sm">
                  {[
                    { label: "Land", value: pb.landCost },
                    { label: "Construction", value: pb.buildCost },
                    { label: "Labour", value: pb.labourCost },
                    { label: "Material", value: pb.matCost },
                    { label: "Other Exp", value: pb.expCost },
                    { label: "Total Cost", value: pb.totalCost },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center bg-muted/50 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-semibold text-xs mt-0.5">{formatCurrency(value)}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue / Profit */}
                <div className="flex items-center gap-6 mb-4 text-sm">
                  <div><p className="text-muted-foreground text-xs">Revenue</p><p className="font-bold text-blue-600">{formatCurrency(pb.revenue)}</p></div>
                  <div><p className="text-muted-foreground text-xs">Profit</p><p className={`font-bold ${pb.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(pb.profit)}</p></div>
                  <div><p className="text-muted-foreground text-xs">Properties</p><p className="font-bold">{properties.filter(p => p.projectId === pb.project.id).length}</p></div>
                  <div><p className="text-muted-foreground text-xs">Sold</p><p className="font-bold">{sales.filter(s => s.projectId === pb.project.id).length}</p></div>
                </div>

                {/* Revenue progress bar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${pct >= 100 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : "bg-orange-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{pct}% recovered</span>
                </div>

                {/* Partner distribution */}
                {pb.pps.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Partner Distribution</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {pb.pps.map(pp => {
                        const partner = partners.find(p => p.id === pp.partnerId)
                        const profitShare = (pb.profit * pp.sharePercent) / 100
                        return (
                          <div key={pp.id} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2 text-sm">
                            <div>
                              <p className="font-medium">{partner?.name || pp.partnerName}</p>
                              <p className="text-xs text-muted-foreground">{pp.sharePercent}% share · Inv: {formatCurrency(pp.investedAmount)}</p>
                            </div>
                            <p className={`font-bold text-sm ${profitShare >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(profitShare)}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
          {projectBreakdown.length === 0 && <p className="text-muted-foreground text-center py-12">No projects yet. Add a project to see investment breakdown.</p>}
        </div>
      </div>

      {/* Partner summary */}
      {partnerSummary.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Partner Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerSummary.map(({ partner, invested, profitShare, assignments }) => (
              <Card key={partner.id} className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">{partner.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{assignments.length} project{assignments.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {assignments.map(a => {
                    const proj = projects.find(p => p.id === a.projectId)
                    const ps = sales.filter(s => s.projectId === a.projectId).reduce((sum, sale) => sum + ((sale.profit || 0) * a.sharePercent / 100), 0)
                    return (
                      <div key={a.id} className="flex justify-between text-xs bg-muted/40 rounded px-2 py-1.5">
                        <span className="font-medium">{proj?.name}</span>
                        <span className="text-muted-foreground">{a.sharePercent}% · <span className={ps >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(ps)}</span></span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between text-sm">
                  <div><p className="text-xs text-muted-foreground">Total Invested</p><p className="font-bold">{formatCurrency(invested)}</p></div>
                  <div className="text-right"><p className="text-xs text-muted-foreground">Total Profit Share</p><p className={`font-bold ${profitShare >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(profitShare)}</p></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
