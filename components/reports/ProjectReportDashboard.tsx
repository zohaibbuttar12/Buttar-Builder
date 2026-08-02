"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, Download, FileText, ImageIcon, Printer, Search } from "lucide-react"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useData } from "@/lib/context/DataContext"
import { formatCurrency, formatDate } from "@/lib/utils"

type TabKey = "Overview" | "Labour" | "Material" | "Vendors" | "Expenses" | "Land" | "Sales" | "Documents" | "Photos"

type Column<T> = {
  key: string
  label: string
  render?: (value: any, row: T) => React.ReactNode
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function ReportTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  emptyText,
  searchFields,
  filterKey,
  filterOptions,
  filterValue,
  onFilterChange,
  pageSize = 6,
}: {
  title: string
  data: T[]
  columns: Column<T>[]
  emptyText: string
  searchFields: string[]
  filterKey?: string
  filterOptions?: { label: string; value: string }[]
  filterValue?: string
  onFilterChange?: (value: string) => void
  pageSize?: number
}) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<string>(columns[0]?.key ?? "")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let next = [...data]

    if (filterKey && filterValue) {
      next = next.filter((row) => String(row[filterKey] ?? "") === String(filterValue))
    }

    if (query.trim()) {
      const search = query.trim().toLowerCase()
      next = next.filter((row) =>
        searchFields.some((field) => String(row[field] ?? "").toLowerCase().includes(search))
      )
    }

    if (sortKey) {
      next.sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        const nA = Number(av)
        const nB = Number(bv)
        const isNumeric = Number.isFinite(nA) && Number.isFinite(nB)

        if (isNumeric) {
          return sortDirection === "asc" ? nA - nB : nB - nA
        }

        const as = String(av ?? "").toLowerCase()
        const bs = String(bv ?? "").toLowerCase()
        return sortDirection === "asc" ? as.localeCompare(bs) : bs.localeCompare(as)
      })
    }

    return next
  }, [data, filterKey, filterValue, query, searchFields, sortDirection, sortKey])

  useEffect(() => {
    setPage(1)
  }, [query, filterValue, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <Card className="p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500">{filtered.length} records</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#D4AF37] dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {filterOptions && (
            <select
              value={filterValue ?? ""}
              onChange={(e) => onFilterChange?.(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#D4AF37] dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="">All</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#D4AF37] dark:border-slate-700 dark:bg-slate-900"
          >
            {columns.map((column) => (
              <option key={column.key} value={column.key}>
                Sort by {column.label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
          >
            {sortDirection === "asc" ? "Asc" : "Desc"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              visibleRows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-b border-slate-200 last:border-none dark:border-slate-700">
                  {columns.map((column) => (
                    <td key={`${title}-${column.key}-${index}`} className="px-3 py-3 align-top text-slate-700 dark:text-slate-200">
                      {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-slate-500">
              Page {safePage} / {totalPages}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function ProjectReportDashboard({ projectId }: { projectId: string }) {
  const router = useRouter()
  const { projects, labourPayments, materialPurchases, expenses, sales, landSales, projectLandAssignments, purchasedLands, loading, error } = useData()
  const [activeTab, setActiveTab] = useState<TabKey>("Overview")
  const [vendorFilter, setVendorFilter] = useState("")

  const project = useMemo(() => projects.find((item) => item.id === projectId), [projectId, projects])

  const labourRows = useMemo(
    () => labourPayments.filter((item) => item.projectId === projectId),
    [labourPayments, projectId]
  )

  const materialRows = useMemo(
    () => materialPurchases.filter((item) => item.projectId === projectId),
    [materialPurchases, projectId]
  )

  const expenseRows = useMemo(
    () => expenses.filter((item) => item.projectId === projectId),
    [expenses, projectId]
  )

  const propertySalesRows = useMemo(
    () => sales.filter((item) => item.projectId === projectId),
    [projectId, sales]
  )

  const assignmentRows = useMemo(
    () => projectLandAssignments.filter((item) => item.projectId === projectId),
    [projectId, projectLandAssignments]
  )

  const purchasedLandRows = useMemo(
    () =>
      purchasedLands.filter((land) =>
        assignmentRows.some((assignment) => assignment.purchasedLandId === land.id)
      ),
    [assignmentRows, purchasedLands]
  )

  const linkedLandSales = useMemo(
    () =>
      landSales.filter(
        (sale) =>
          sale.projectId === projectId ||
          assignmentRows.some((assignment) => assignment.purchasedLandId === sale.purchasedLandId)
      ),
    [assignmentRows, landSales, projectId]
  )

  const vendorRows = useMemo(() => {
    const entries = new Map<string, { vendor: string; materialCost: number; paymentCost: number; expenseCost: number }>()

    materialRows.forEach((row) => {
      const vendor = row.vendorName || "Unassigned Vendor"
      const current = entries.get(vendor) || { vendor, materialCost: 0, paymentCost: 0, expenseCost: 0 }
      current.materialCost += Number(row.total || 0)
      entries.set(vendor, current)
    })

    expenseRows.forEach((row) => {
      const vendor = row.vendorPerson || "Unassigned Vendor"
      const current = entries.get(vendor) || { vendor, materialCost: 0, paymentCost: 0, expenseCost: 0 }
      current.expenseCost += Number(row.amount || 0)
      entries.set(vendor, current)
    })

    return Array.from(entries.values()).map((entry) => ({
      vendor: entry.vendor,
      materialCost: entry.materialCost,
      paymentCost: entry.paymentCost,
      expenseCost: entry.expenseCost,
      total: entry.materialCost + entry.expenseCost,
    }))
  }, [expenseRows, materialRows])

  const totalLabour = labourRows.reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const totalMaterial = materialRows.reduce((sum, row) => sum + Number(row.total || 0), 0)
  const totalExpenses = expenseRows.reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const totalLandCost = assignmentRows.reduce((sum, row) => sum + Number(row.landCost || 0), 0)
  const totalRevenue = propertySalesRows.reduce((sum, row) => sum + Number(row.salePrice || 0), 0) + linkedLandSales.reduce((sum, row) => sum + Number(row.salePrice || 0), 0)
  const totalBudget = Number(project?.estimatedBudget || 0)
  const totalSpend = totalLabour + totalMaterial + totalExpenses + totalLandCost
  const remainingBudget = totalBudget - totalSpend
  const profit = totalRevenue - totalSpend
  const progress = totalBudget > 0 ? Math.min(100, Math.round((totalSpend / totalBudget) * 100)) : 0

  const documentRows = useMemo(
    () => [
      { name: "Project Overview", type: "Summary", uploadedAt: project?.createdAt || new Date().toISOString() },
      { name: "Budget Sheet", type: "Financial", uploadedAt: project?.createdAt || new Date().toISOString() },
    ],
    [project]
  )

  const photoRows = useMemo(
    () => [
      { title: "Site Progress Photo", date: project?.startDate || new Date().toISOString() },
      { title: "Construction Update", date: project?.createdAt || new Date().toISOString() },
    ],
    [project]
  )

  const exportPdf = () => {
    if (!project) return

    const doc = new jsPDF({ unit: "pt", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 42
    let y = 36

    const logoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <rect width="120" height="120" rx="20" fill="#111827"/>
        <circle cx="60" cy="60" r="38" fill="#D4AF37"/>
        <text x="60" y="68" text-anchor="middle" font-size="34" font-weight="700" fill="#111827" font-family="Arial">BB</text>
      </svg>
    `)}`

    try {
      doc.addImage(logoSvg, "PNG", margin, 26, 44, 44)
    } catch {
      doc.setFillColor(212, 175, 55)
      doc.roundedRect(margin, 26, 44, 44, 8, 8, "F")
      doc.setTextColor(17, 24, 39)
      doc.setFontSize(16)
      doc.text("BB", margin + 18, 56)
    }

    doc.setTextColor(17, 24, 39)
    doc.setFontSize(18)
    doc.text("BUTTAR BUILDERS & DEVELOPERS", margin + 56, 42)
    doc.setFontSize(11)
    doc.text("Project Financial Report", margin + 56, 60)

    doc.setFontSize(10)
    doc.text(`Project: ${project.name}`, margin, 110)
    doc.text(`Client: ${project.clientName || "—"}`, margin, 124)
    doc.text(`Location: ${project.location || "—"}`, margin, 138)
    doc.text(`Status: ${project.status || "—"}`, margin, 152)

    const summaryLines = [
      `Budget: ${formatCurrency(totalBudget)}`,
      `Spent: ${formatCurrency(totalSpend)}`,
      `Remaining: ${formatCurrency(remainingBudget)}`,
      `Revenue: ${formatCurrency(totalRevenue)}`,
      `Profit: ${formatCurrency(profit)}`,
      `Progress: ${progress}%`,
    ]

    y = 178
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Summary", margin, y)
    doc.setFont("helvetica", "normal")
    y += 16
    doc.setFontSize(10)
    summaryLines.forEach((line) => {
      doc.text(line, margin, y)
      y += 16
    })

    y += 8
    doc.setFont("helvetica", "bold")
    doc.text("Labour Payments", margin, y)
    doc.setFont("helvetica", "normal")
    y += 14
    labourRows.slice(0, 6).forEach((row) => {
      doc.text(`${row.labourName} - ${formatCurrency(Number(row.amount || 0))} - ${formatDate(row.date)}`, margin, y)
      y += 12
    })

    if (y > 660) {
      doc.addPage()
      y = 42
    }

    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Material Purchases", margin, y)
    doc.setFont("helvetica", "normal")
    y += 14
    materialRows.slice(0, 6).forEach((row) => {
      doc.text(`${row.vendorName || "Vendor"} - ${row.materialType} - ${formatCurrency(Number(row.total || 0))}`, margin, y)
      y += 12
    })

    if (y > 660) {
      doc.addPage()
      y = 42
    }

    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Expenses", margin, y)
    doc.setFont("helvetica", "normal")
    y += 14
    expenseRows.slice(0, 6).forEach((row) => {
      doc.text(`${row.category} - ${row.vendorPerson || "Vendor"} - ${formatCurrency(Number(row.amount || 0))}`, margin, y)
      y += 12
    })

    if (y > 660) {
      doc.addPage()
      y = 42
    }

    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Land & Sales", margin, y)
    doc.setFont("helvetica", "normal")
    y += 14
    linkedLandSales.slice(0, 6).forEach((row) => {
      doc.text(`${row.projectName || project.name} - ${formatCurrency(Number(row.salePrice || 0))} - ${formatDate(row.saleDate)}`, margin, y)
      y += 12
    })

    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Authorized Signature", margin, y + 26)
    doc.setLineWidth(0.8)
    doc.line(margin, y + 36, margin + 170, y + 36)
    doc.setFontSize(9)
    doc.text("Manager / Finance Team", margin, y + 52)

    doc.save(`${project.name.replace(/\s+/g, "-").toLowerCase()}-report.pdf`)
  }

  const exportExcel = () => {
    if (!project) return

    const rows: any[][] = [
      ["Project Report", project.name],
      ["Client", project.clientName || "—"],
      ["Location", project.location || "—"],
      ["Budget", totalBudget],
      ["Total Spent", totalSpend],
      ["Remaining Budget", remainingBudget],
      ["Revenue", totalRevenue],
      ["Profit", profit],
      ["Progress %", progress],
      [],
      ["Labour Name", "Work Description", "Amount", "Date"],
      ...labourRows.map((row) => [row.labourName, row.workDescription, row.amount, row.date]),
      [],
      ["Vendor", "Material Cost", "Expense Cost", "Total"],
      ...vendorRows.map((row) => [row.vendor, row.materialCost, row.expenseCost, row.total]),
      [],
      ["Material Type", "Vendor", "Quantity", "Total", "Date"],
      ...materialRows.map((row) => [row.materialType, row.vendorName, row.quantity, row.total, row.date]),
      [],
      ["Category", "Description", "Vendor", "Amount", "Date"],
      ...expenseRows.map((row) => [row.category, row.description, row.vendorPerson, row.amount, row.date]),
    ]

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n")

    downloadBlob(csv, `${project.name.replace(/\s+/g, "-").toLowerCase()}-report.csv`, "application/vnd.ms-excel;charset=utf-8;")
  }

  const printReport = () => window.print()

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Button variant="ghost" onClick={() => router.push("/reports")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Unable to load project report</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{error}</p>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Button variant="ghost" onClick={() => router.push("/reports")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">The selected report does not exist or is no longer available.</p>
        </Card>
      </div>
    )
  }

  const tabs: TabKey[] = ["Overview", "Labour", "Material", "Vendors", "Expenses", "Land", "Sales", "Documents", "Photos"]

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Budget Summary</p>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalBudget)}</p>
          <p className="mt-2 text-sm text-slate-500">Total planned budget</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Spent</p>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalSpend)}</p>
          <p className="mt-2 text-sm text-slate-500">Across labour, material and expenses</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Progress</p>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{progress}%</p>
          <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-2 rounded-full bg-[#D4AF37]" style={{ width: `${progress}%` }} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Remaining Budget</p>
          <p className={`mt-3 text-2xl font-bold ${remainingBudget >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {formatCurrency(remainingBudget)}
          </p>
          <p className="mt-2 text-sm text-slate-500">Projected funds left</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project Overview</h3>
            <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-medium text-[#8D6C12]">{project.status}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Project Name</p>
              <p className="mt-2 text-base font-semibold">{project.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Client</p>
              <p className="mt-2 text-base font-semibold">{project.clientName || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
              <p className="mt-2 text-base font-semibold">{project.location || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Start Date</p>
              <p className="mt-2 text-base font-semibold">{project.startDate ? formatDate(project.startDate) : "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Contract Amount</p>
              <p className="mt-2 text-base font-semibold">{formatCurrency(project.contractAmount || 0)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Project ID</p>
              <p className="mt-2 text-base font-semibold">{project.id}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Financial Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
              <span className="text-slate-500">Labour</span>
              <span className="font-semibold">{formatCurrency(totalLabour)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
              <span className="text-slate-500">Material</span>
              <span className="font-semibold">{formatCurrency(totalMaterial)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
              <span className="text-slate-500">Expenses</span>
              <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
              <span className="text-slate-500">Land Cost</span>
              <span className="font-semibold">{formatCurrency(totalLandCost)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-3">
              <span className="font-medium text-slate-900 dark:text-white">Profit Calculation</span>
              <span className={`font-bold ${profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatCurrency(profit)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportTable
          title="Labour Payments"
          data={labourRows}
          emptyText="No labour payment entries found for this project."
          searchFields={["labourName", "workDescription", "date"]}
          columns={[
            { key: "labourName", label: "Labour" },
            { key: "workDescription", label: "Description" },
            { key: "amount", label: "Amount", render: (value) => formatCurrency(Number(value || 0)) },
            { key: "date", label: "Date", render: (value) => formatDate(value) },
          ]}
          pageSize={5}
        />

        <ReportTable
          title="Material Purchases"
          data={materialRows}
          emptyText="No material purchases recorded for this project."
          searchFields={["materialType", "vendorName", "date"]}
          columns={[
            { key: "materialType", label: "Material" },
            { key: "vendorName", label: "Vendor" },
            { key: "quantity", label: "Qty" },
            { key: "total", label: "Total", render: (value) => formatCurrency(Number(value || 0)) },
          ]}
          pageSize={5}
        />
      </div>
    </div>
  )

  const renderLabour = () => (
    <ReportTable
      title="Labour Payments"
      data={labourRows}
      emptyText="No labour payment records found for this project."
      searchFields={["labourName", "workDescription", "date"]}
      columns={[
        { key: "labourName", label: "Labour" },
        { key: "workDescription", label: "Description" },
        { key: "amount", label: "Amount", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "date", label: "Date", render: (value) => formatDate(value) },
      ]}
      pageSize={8}
    />
  )

  const renderMaterial = () => (
    <ReportTable
      title="Material Purchases"
      data={materialRows}
      emptyText="No material purchases recorded for this project."
      searchFields={["materialType", "vendorName", "date"]}
      columns={[
        { key: "materialType", label: "Material Type" },
        { key: "vendorName", label: "Vendor" },
        { key: "quantity", label: "Qty" },
        { key: "unit", label: "Unit" },
        { key: "rate", label: "Rate", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "total", label: "Total", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "date", label: "Date", render: (value) => formatDate(value) },
      ]}
      pageSize={8}
    />
  )

  const renderVendors = () => (
    <ReportTable
      title="Vendor Payments"
      data={vendorRows}
      emptyText="No vendor payment records found for this project."
      searchFields={["vendor", "materialCost", "expenseCost", "total"]}
      filterKey="vendor"
      filterOptions={vendorRows.map((row) => ({ label: row.vendor, value: row.vendor }))}
      filterValue={vendorFilter}
      onFilterChange={setVendorFilter}
      columns={[
        { key: "vendor", label: "Vendor" },
        { key: "materialCost", label: "Material Cost", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "expenseCost", label: "Expense Cost", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "total", label: "Total", render: (value) => formatCurrency(Number(value || 0)) },
      ]}
      pageSize={8}
    />
  )

  const renderExpenses = () => (
    <ReportTable
      title="Expenses"
      data={expenseRows}
      emptyText="No expense entries found for this project."
      searchFields={["category", "description", "vendorPerson", "date"]}
      columns={[
        { key: "category", label: "Category" },
        { key: "description", label: "Description" },
        { key: "vendorPerson", label: "Vendor / Paid To" },
        { key: "amount", label: "Amount", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "date", label: "Date", render: (value) => formatDate(value) },
      ]}
      pageSize={8}
    />
  )

  const renderLand = () => (
    <div className="space-y-6">
      <ReportTable
        title="Purchased Land Details"
        data={purchasedLandRows}
        emptyText="No purchased land records are assigned to this project yet."
        searchFields={["plotName", "plotNumber", "location", "owner"]}
        columns={[
          { key: "plotName", label: "Plot Name" },
          { key: "plotNumber", label: "Plot Number" },
          { key: "location", label: "Location" },
          { key: "totalArea", label: "Area" },
          { key: "unit", label: "Unit" },
          { key: "purchasePrice", label: "Purchase Price", render: (value) => formatCurrency(Number(value || 0)) },
        ]}
        pageSize={8}
      />

      <ReportTable
        title="Land Sales Details"
        data={linkedLandSales}
        emptyText="No land sales are linked to this project."
        searchFields={["plotName", "customerName", "saleDate"]}
        columns={[
          { key: "plotName", label: "Plot" },
          { key: "customerName", label: "Customer" },
          { key: "areaSold", label: "Area Sold" },
          { key: "salePrice", label: "Sale Price", render: (value) => formatCurrency(Number(value || 0)) },
          { key: "landPurchaseCost", label: "Land Cost", render: (value) => formatCurrency(Number(value || 0)) },
          { key: "landProfit", label: "Profit", render: (value) => formatCurrency(Number(value || 0)) },
          { key: "saleDate", label: "Date", render: (value) => formatDate(value) },
        ]}
        pageSize={8}
      />
    </div>
  )

  const renderSales = () => (
    <ReportTable
      title="Sales"
      data={propertySalesRows}
      emptyText="No property sales recorded for this project."
      searchFields={["buyerName", "propertyLabel", "saleDate", "paymentMode"]}
      columns={[
        { key: "propertyLabel", label: "Property" },
        { key: "buyerName", label: "Buyer" },
        { key: "paymentMode", label: "Mode" },
        { key: "salePrice", label: "Sale Price", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "profit", label: "Profit", render: (value) => formatCurrency(Number(value || 0)) },
        { key: "saleDate", label: "Date", render: (value) => formatDate(value) },
      ]}
      pageSize={8}
    />
  )

  const renderDocuments = () => (
    <ReportTable
      title="Project Documents"
      data={documentRows}
      emptyText="No project documents have been uploaded yet."
      searchFields={["name", "type"]}
      columns={[
        { key: "name", label: "Document" },
        { key: "type", label: "Type" },
        { key: "uploadedAt", label: "Uploaded", render: (value) => formatDate(String(value || "")) },
      ]}
      pageSize={8}
    />
  )

  const renderPhotos = () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {photoRows.length === 0 ? (
        <Card className="p-6 md:col-span-2 xl:col-span-3">
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-slate-500">
            <ImageIcon className="h-10 w-10" />
            <p>No progress photos uploaded for this project yet.</p>
          </div>
        </Card>
      ) : (
        photoRows.map((photo, index) => (
          <Card key={`${photo.title}-${index}`} className="overflow-hidden">
            <div className="h-48 bg-[radial-gradient(circle,_rgba(212,175,55,0.18),_transparent_60%)]" />
            <div className="p-4">
              <p className="font-semibold text-slate-900 dark:text-white">{photo.title}</p>
              <p className="mt-2 text-xs text-slate-500">{formatDate(String(photo.date || ""))}</p>
            </div>
          </Card>
        ))
      )}
    </div>
  )

  const tabContent: Record<TabKey, JSX.Element> = {
    Overview: renderOverview(),
    Labour: renderLabour(),
    Material: renderMaterial(),
    Vendors: renderVendors(),
    Expenses: renderExpenses(),
    Land: renderLand(),
    Sales: renderSales(),
    Documents: renderDocuments(),
    Photos: renderPhotos(),
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Button type="button" variant="ghost" onClick={() => router.push("/reports")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">Project Report</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="gap-2" onClick={exportPdf}>
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button type="button" variant="outline" className="gap-2" onClick={exportExcel}>
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Button type="button" className="gap-2 bg-[#D4AF37] text-slate-950 hover:bg-[#c49a26]" onClick={printReport}>
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-[#D4AF37] text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {tabContent[activeTab]}
    </div>
  )
}
