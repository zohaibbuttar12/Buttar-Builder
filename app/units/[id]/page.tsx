"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Building2, ClipboardList, Layers3, Users, Wallet } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const tabs = ["Overview", "Materials", "Labour", "Expenses"]

export default function UnitDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview")
  const params = useParams()
  const pdfRef = useRef<HTMLDivElement | null>(null)
  const { properties, partners, materialPurchases, labourPayments, expenses } = useData()
  const property = properties.find((item) => item.id === params.id)

  const owner = property ? partners.find((partner) => partner.id === property.projectId) : undefined
  const materials = property ? materialPurchases.filter((item) => item.projectId === property.projectId) : []
  const labour = property ? labourPayments.filter((item) => item.projectId === property.projectId) : []
  const costs = property ? expenses.filter((item) => item.projectId === property.projectId) : []

  const statItems = useMemo(
    () => [
      { label: "Materials", value: `${materials.length}` },
      { label: "Labour", value: `${labour.length}` },
      { label: "Expenses", value: `${costs.length}` },
      { label: "Progress", value: "78%" },
    ],
    [materials.length, labour.length, costs.length]
  )

  const downloadPdf = useCallback(async () => {
    if (!pdfRef.current || !property) return
    const element = pdfRef.current
    const canvas = await html2canvas(element, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("portrait", "pt", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${property.plotNumber || "unit-detail"}.pdf`)
  }, [property])

  if (!property) return notFound()

  return (
    <div className="space-y-6" ref={pdfRef}>
      <Link href="/units" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#D4AF37]">
        <ArrowLeft className="h-4 w-4" /> Back to Units
      </Link>

      <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Unit Profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{property.plotNumber || "Premium Unit"}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Detailed construction tracking for owner, materials, labour, and expenses.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={downloadPdf}
              className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#b38a2b]"
            >
              Download PDF
            </button>
            <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">{property.status}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${activeTab === tab ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0f172a] dark:text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="p-6">
              <h2 className="text-xl font-semibold">Overview</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>Unit Number</span><span className="font-semibold text-slate-900 dark:text-white">{property.plotNumber || "A-12"}</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>Owner / Investor</span><span className="font-semibold text-slate-900 dark:text-white">{owner?.name || "Investor"}</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>Construction Status</span><span className="font-semibold text-slate-900 dark:text-white">{property.status}</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-800"><span>Budget</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(property.landPurchasePrice + (property.totalConstructionCost || 0))}</span></div>
                <div className="flex justify-between"><span>Payment Status</span><span className="font-semibold text-slate-900 dark:text-white">In Progress</span></div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold">Project Snapshot</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {statItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === "Materials" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Materials</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Detailed material purchase records for this unit.</p>
            </div>
            <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">{materials.length} entries</div>
          </div>

          {materials.length === 0 ? (
            <Card className="p-6 text-sm text-slate-600 dark:text-slate-300">No material entries are linked to this unit yet.</Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Material</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Rate</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{item.materialType}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.quantity}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.unit}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatCurrency(item.rate)}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatCurrency(item.total)}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.vendorName}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "Labour" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Labour</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Labour payments and crew assignments for this unit.</p>
            </div>
            <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">{labour.length} entries</div>
          </div>

          {labour.length === 0 ? (
            <Card className="p-6 text-sm text-slate-600 dark:text-slate-300">No labour entries are linked to this unit yet.</Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Labour</th>
                    <th className="px-4 py-3">Trade</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Work Description</th>
                    <th className="px-4 py-3">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {labour.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{item.labourName}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.workDescription}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatCurrency(item.amount)}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.labourName}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "Expenses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Expenses</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Costs linked to this unit.</p>
            </div>
            <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">{costs.length} entries</div>
          </div>

          {costs.length === 0 ? (
            <Card className="p-6 text-sm text-slate-600 dark:text-slate-300">No expense entries are linked to this unit yet.</Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Vendor / Person</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{item.category}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.description}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.vendorPerson}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatCurrency(item.amount)}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
