"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddSaleDialog } from "@/components/dialogs/AddSaleDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SaleForm } from "@/components/forms/SaleForm"
import { Sale } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { TrendingUp, DollarSign, Package, Users } from "lucide-react"

const PAYMENT_COLORS: Record<string, string> = {
  cash: "bg-green-100 text-green-800",
  "bank-transfer": "bg-blue-100 text-blue-800",
  cheque: "bg-purple-100 text-purple-800",
  installment: "bg-orange-100 text-orange-800",
}

export default function SalesPage() {
  const { sales, projects, properties, partners, projectPartners, addSale, updateSale, deleteSale } = useData()
  const [editing, setEditing] = useState<Sale | null>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || "—"

  const totalRevenue = sales.reduce((s, x) => s + x.salePrice, 0)
  const totalProfit = sales.reduce((s, x) => s + (x.profit || 0), 0)
  const totalCost = sales.reduce((s, x) => s + (x.propertyCost || 0), 0)

  // Partner profit distribution for a sale
  const getSalePartnerBreakdown = (sale: Sale) => {
    const pps = projectPartners.filter(pp => pp.projectId === sale.projectId)
    return pps.map(pp => {
      const partner = partners.find(p => p.id === pp.partnerId)
      const share = ((sale.profit || 0) * pp.sharePercent) / 100
      return { partnerName: partner?.name || pp.partnerName || "—", sharePercent: pp.sharePercent, profitShare: share }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground mt-1">Track property sales & revenue</p>
        </div>
        <AddSaleDialog onAdd={addSale} projects={projects} properties={properties} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4"><p className="text-xs text-muted-foreground flex items-center gap-1"><Package className="h-3 w-3" />Total Sales</p><p className="text-2xl font-bold mt-1">{sales.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />Total Revenue</p><p className="text-xl font-bold mt-1 text-blue-600">{formatCurrency(totalRevenue)}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Cost</p><p className="text-xl font-bold mt-1 text-orange-600">{formatCurrency(totalCost)}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" />Net Profit</p><p className={`text-xl font-bold mt-1 ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(totalProfit)}</p></Card>
      </div>

      <Card className="p-6">
        <DataTable
          columns={[
            { key: "propertyLabel", label: "Property", render: (v, r: any) => v || `Unit — ${r.propertyId?.slice(0, 8)}` },
            { key: "projectId", label: "Project", render: v => getProjectName(v) },
            { key: "buyerName", label: "Buyer" },
            { key: "saleDate", label: "Date", render: v => formatDate(v) },
            { key: "salePrice", label: "Sale Price", render: v => formatCurrency(v) },
            { key: "propertyCost", label: "Cost", render: v => formatCurrency(v || 0) },
            { key: "profit", label: "Profit", render: v => <span className={`font-semibold ${(v||0) >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(v || 0)}</span> },
            { key: "paymentMode", label: "Payment", render: v => <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${PAYMENT_COLORS[v] || ""}`}>{v?.replace("-", " ")}</span> },
            { key: "id", label: "Partners", render: (_, row: any) => {
              const breakdown = getSalePartnerBreakdown(row as Sale)
              if (!breakdown.length) return <span className="text-muted-foreground text-xs">—</span>
              return <button onClick={() => setSelectedSale(row as Sale)} className="text-xs text-primary underline">View ({breakdown.length})</button>
            }},
          ]}
          data={sales} onEdit={setEditing} onDelete={deleteSale}
          searchableColumns={["buyerName"]} getRowKey={s => s.id}
        />
      </Card>

      {/* Partner distribution modal */}
      {selectedSale && (
        <Dialog open onOpenChange={() => setSelectedSale(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Partner Profit Distribution</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium">{selectedSale.propertyLabel}</p>
                <p className="text-muted-foreground mt-0.5">Sale: {formatCurrency(selectedSale.salePrice)} &nbsp;|&nbsp; Profit: <span className={selectedSale.profit! >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{formatCurrency(selectedSale.profit || 0)}</span></p>
              </div>
              <div className="space-y-2">
                {getSalePartnerBreakdown(selectedSale).map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{b.partnerName}</p>
                      <p className="text-xs text-muted-foreground">{b.sharePercent}% share</p>
                    </div>
                    <p className={`font-bold text-sm ${b.profitShare >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(b.profitShare)}</p>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Sale</DialogTitle></DialogHeader>
            <SaleForm projects={projects} properties={properties} initialValues={editing} onSubmit={d => { updateSale(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
