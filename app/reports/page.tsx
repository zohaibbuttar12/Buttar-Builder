"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, BarChart3, FolderKanban } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useData } from "@/lib/context/DataContext"
import { formatCurrency } from "@/lib/utils"

export default function ReportsPage() {
  const router = useRouter()
  const { projects, labourPayments, materialPurchases, expenses, landSales, loading, error } = useData()

  const totalLandProfit = landSales.reduce((sum, item) => sum + (Number(item.landProfit) || 0), 0)
  const totalLandSalePrice = landSales.reduce((sum, item) => sum + (Number(item.salePrice) || 0), 0)
  const totalLandPurchaseCost = landSales.reduce((sum, item) => sum + (Number(item.landPurchaseCost) || 0), 0)

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-44 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Unable to load report dashboard</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">Reports</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Project Performance Overview</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Projects</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{projects.length}</p>
          <p className="mt-2 text-sm text-slate-500">Across the construction portfolio</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Land Profit</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{formatCurrency(totalLandProfit)}</p>
          <p className="mt-2 text-sm text-slate-500">From {landSales.length} land sales</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Land Sales</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalLandSalePrice)}</p>
          <p className="mt-2 text-sm text-slate-500">Purchase cost {formatCurrency(totalLandPurchaseCost)}</p>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <FolderKanban className="h-4 w-4 text-[#D4AF37]" />
          <span className="font-medium">Project Reports</span>
        </div>

        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-500">No projects yet. Add a project to generate report insights.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const labour = labourPayments.filter((item) => item.projectId === project.id).reduce((sum, item) => sum + Number(item.amount || 0), 0)
              const material = materialPurchases.filter((item) => item.projectId === project.id).reduce((sum, item) => sum + Number(item.total || 0), 0)
              const expense = expenses.filter((item) => item.projectId === project.id).reduce((sum, item) => sum + Number(item.amount || 0), 0)
              const spent = labour + material + expense
              const percent = project.estimatedBudget > 0 ? Math.min(100, Math.round((spent / project.estimatedBudget) * 100)) : 0
              const remaining = project.estimatedBudget - spent

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => router.push(`/reports/${project.id}`)}
                  className="group text-left"
                >
                  <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/60 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{project.status}</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{project.name}</h3>
                      </div>
                      <span className="rounded-full bg-[#D4AF37]/10 p-2 text-[#8D6C12]">
                        <BarChart3 className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                        <span>Budget</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(project.estimatedBudget)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                        <span>Spent</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(spent)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                        <span>Remaining</span>
                        <span className={`font-semibold ${remaining >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {formatCurrency(remaining)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Progress</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className="h-2 rounded-full bg-[#D4AF37]" style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-sm font-medium text-[#8D6C12]">
                      <span>Open project report</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    </div>
  )
}
