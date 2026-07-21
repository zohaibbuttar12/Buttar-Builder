"use client"
import { useData } from "@/lib/context/DataContext"
import { SummaryCard } from "@/components/cards/SummaryCard"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/tables/DataTable"
import { BarChart3, Banknote, FolderOpen, Hammer, ShoppingCart, Wallet, RefreshCw, TrendingUp, Home, Users, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function DashboardPage() {
  const { stats, labourPayments, expenses, materialPurchases, projects, properties, sales, partners, loading, error, refreshData } = useData()

  const totalRevenue = sales.reduce((s, x) => s + x.salePrice, 0)
  const totalProfit = sales.reduce((s, x) => s + (x.profit || 0), 0)
  const availableProps = properties.filter(p => p.status === "available").length
  const soldProps = properties.filter(p => p.status === "sold").length

  const projectData = projects.map(p => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
    budget: p.estimatedBudget,
    spent: labourPayments.filter(x => x.projectId === p.id).reduce((s, x) => s + x.amount, 0)
      + materialPurchases.filter(x => x.projectId === p.id).reduce((s, x) => s + x.total, 0)
      + expenses.filter(x => x.projectId === p.id).reduce((s, x) => s + x.amount, 0),
    revenue: sales.filter(x => x.projectId === p.id).reduce((s, x) => s + x.salePrice, 0),
  }))

  const expensePie = [
    { name: "Labour", value: stats.labourCost },
    { name: "Material", value: stats.materialCost },
    { name: "Land", value: properties.reduce((s, p) => s + p.landPurchasePrice + p.transferFees, 0) },
    { name: "Construction", value: properties.reduce((s, p) => s + (p.totalConstructionCost || 0), 0) },
    { name: "Other", value: stats.totalExpenses },
  ].filter(x => x.value > 0)

  const recent = [
    ...labourPayments.map(x => ({ id: x.id, type: "Labour", desc: x.labourName, amount: x.amount, date: x.date, color: "text-purple-600" })),
    ...materialPurchases.map(x => ({ id: x.id, type: "Material", desc: x.materialType, amount: x.total, date: x.date, color: "text-orange-600" })),
    ...expenses.map(x => ({ id: x.id, type: "Expense", desc: x.description, amount: x.amount, date: x.date, color: "text-red-600" })),
    ...sales.map(x => ({ id: x.id, type: "Sale", desc: x.buyerName + " — " + (x.propertyLabel || ""), amount: x.salePrice, date: x.saleDate, color: "text-green-600" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading…</div>
  if (error) return <div className="flex items-center justify-center h-64 text-destructive">Error: {error}</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Buttar Builders & Developers</p>
        </div>
        <Button variant="outline" onClick={refreshData} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
      </div>

      {/* Investment quick-links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/investment", label: "Investment Dashboard", icon: TrendingUp, color: "border-blue-200 bg-blue-50 text-blue-700" },
          { href: "/properties", label: `${properties.length} Properties`, icon: Home, color: "border-amber-200 bg-amber-50 text-amber-700" },
          { href: "/sales", label: `${sales.length} Sales`, icon: DollarSign, color: "border-green-200 bg-green-50 text-green-700" },
          { href: "/partners", label: `${partners.length} Partners`, icon: Users, color: "border-purple-200 bg-purple-50 text-purple-700" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href} className={`flex items-center gap-3 p-4 rounded-lg border transition-opacity hover:opacity-80 ${color}`}>
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold">{label}</span>
          </Link>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Projects" value={stats.totalProjects} icon={FolderOpen} description={`${projects.filter(p => p.status === "active").length} active`} />
        <SummaryCard title="Properties Available" value={availableProps} icon={Home} description={`${soldProps} sold`} />
        <SummaryCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={TrendingUp} description="From all sales" />
        <SummaryCard title="Net Profit" value={formatCurrency(totalProfit)} icon={BarChart3} description="Revenue minus costs" />
        <SummaryCard title="Labour Cost" value={formatCurrency(stats.labourCost)} icon={Hammer} />
        <SummaryCard title="Material Cost" value={formatCurrency(stats.materialCost)} icon={ShoppingCart} />
        <SummaryCard title="Other Expenses" value={formatCurrency(stats.totalExpenses)} icon={Wallet} />
        <SummaryCard title="Total Partners" value={partners.length} icon={Users} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projectData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget vs Spent vs Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => "₨" + Math.round(v / 1000) + "K"} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="budget" fill="#94a3b8" name="Budget" />
                <Bar dataKey="spent" fill="#ef4444" name="Spent" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
        {expensePie.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={expensePie} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expensePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <DataTable
          columns={[
            { key: "type", label: "Type", render: (v, r: any) => <span className={`text-xs font-semibold ${r.color}`}>{v}</span> },
            { key: "desc", label: "Description" },
            { key: "date", label: "Date", render: v => formatDate(v) },
            { key: "amount", label: "Amount", render: v => formatCurrency(v) },
          ]}
          data={recent} getRowKey={r => r.id}
        />
      </Card>
    </div>
  )
}
