"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft, BadgeCheck, Building2, CalendarDays, FileText, Landmark, Users, Wallet } from "lucide-react"

export default function InvestorDetailPage() {
  const params = useParams()
  const { partners, projects, properties, sales, labourPayments, materialPurchases, expenses } = useData()
  const partner = partners.find((item) => item.id === params.id)

  if (!partner) return notFound()

  const projectAssignments = projects.filter((project) => project.id === partner.id || project.clientName === partner.name)
  const propertyAssignments = properties.filter((property) => property.projectId && projectAssignments.some((project) => project.id === property.projectId))
  const totalInvestment = propertyAssignments.reduce((sum, property) => sum + property.landPurchasePrice + property.transferFees + (property.totalConstructionCost || 0), 0)
  const labourCost = labourPayments.filter((item) => item.projectId && projectAssignments.some((project) => project.id === item.projectId)).reduce((sum, item) => sum + item.amount, 0)
  const materialCost = materialPurchases.filter((item) => item.projectId && projectAssignments.some((project) => project.id === item.projectId)).reduce((sum, item) => sum + item.total, 0)
  const otherCost = expenses.filter((item) => item.projectId && projectAssignments.some((project) => project.id === item.projectId)).reduce((sum, item) => sum + item.amount, 0)
  const totalCost = totalInvestment + labourCost + materialCost + otherCost
  const revenue = sales.filter((item) => item.projectId && projectAssignments.some((project) => project.id === item.projectId)).reduce((sum, item) => sum + item.salePrice, 0)

  return (
    <div className="space-y-6">
      <Link href="/investment" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#D4AF37]">
        <ArrowLeft className="h-4 w-4" /> Back to Investment Dashboard
      </Link>

      <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Investor Profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{partner.name}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Professional investment profile with project and financial visibility.</p>
          </div>
          <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">Active Investor</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Investment", value: formatCurrency(totalInvestment), icon: Landmark },
          { label: "Current Balance", value: formatCurrency(Math.max(0, revenue - totalCost)), icon: Wallet },
          { label: "Assigned Projects", value: String(projectAssignments.length), icon: Building2 },
          { label: "ROI", value: "12.4%", icon: BadgeCheck },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label} className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#D4AF37]/10 p-3 text-[#D4AF37]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>Full Name</span><span className="font-semibold text-slate-900 dark:text-white">{partner.name}</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>CNIC</span><span className="font-semibold text-slate-900 dark:text-white">42201-1234567-8</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>Phone</span><span className="font-semibold text-slate-900 dark:text-white">+92 300 1234567</span></div>
            <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>Email</span><span className="font-semibold text-slate-900 dark:text-white">{partner.email || "investor@example.com"}</span></div>
            <div className="flex justify-between"><span>Address</span><span className="font-semibold text-slate-900 dark:text-white">Gulberg, Lahore</span></div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Project Details</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {projectAssignments.length > 0 ? projectAssignments.map((project) => (
              <div key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 dark:text-white">{project.name}</p>
                  <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">{project.status}</span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div><p className="text-xs text-muted-foreground">Budget</p><p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(project.estimatedBudget)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Location</p><p className="font-semibold text-slate-900 dark:text-white">{project.location}</p></div>
                </div>
              </div>
            )) : <p>No projects assigned.</p>}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Investment Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Total Investment</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(totalInvestment)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Investment Date</span><span className="font-semibold text-slate-900 dark:text-white">{formatDate(new Date().toISOString())}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Profit Sharing</span><span className="font-semibold text-slate-900 dark:text-white">15%</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Current Balance</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(Math.max(0, revenue - totalCost))}</span></div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Expense Breakdown</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Material Cost</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(materialCost)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Labour Cost</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(labourCost)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Machinery Cost</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(0)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Transport Cost</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(0)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Grand Total</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(totalCost)}</span></div>
          </div>
        </Card>
      </div>
    </div>
  )
}
