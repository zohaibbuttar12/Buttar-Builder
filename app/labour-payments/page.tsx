"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddLabourPaymentDialog } from "@/components/dialogs/AddLabourPaymentDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LabourPaymentForm } from "@/components/forms/LabourPaymentForm"
import { LabourPayment } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function LabourPaymentsPage() {
  const { labourPayments, projects, labours, addLabourPayment, updateLabourPayment, deleteLabourPayment } = useData()
  const [editing, setEditing] = useState<LabourPayment|null>(null)
  const getProject = (id: string) => projects.find(p => p.id === id)?.name || "—"
  const total = labourPayments.reduce((s,p) => s+p.amount, 0)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Labour Payments</h1><p className="text-muted-foreground mt-1">Track labour payment bills</p></div>
        <AddLabourPaymentDialog projects={projects} labours={labours} onAdd={addLabourPayment} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6"><p className="text-sm text-muted-foreground">Total Paid</p><p className="text-2xl font-bold mt-1">{formatCurrency(total)}</p></Card>
        <Card className="p-6"><p className="text-sm text-muted-foreground">Total Bills</p><p className="text-2xl font-bold mt-1">{labourPayments.length}</p></Card>
        <Card className="p-6"><p className="text-sm text-muted-foreground">Average Payment</p><p className="text-2xl font-bold mt-1">{labourPayments.length ? formatCurrency(total/labourPayments.length) : "—"}</p></Card>
      </div>
      <Card className="p-6">
        <DataTable
          columns={[
            { key:"labourName", label:"Worker" },
            { key:"projectId", label:"Project", render: v => getProject(v) },
            { key:"workDescription", label:"Work Description" },
            { key:"date", label:"Date", render: v => formatDate(v) },
            { key:"amount", label:"Amount", render: v => formatCurrency(v) },
          ]}
          data={labourPayments} onEdit={setEditing} onDelete={deleteLabourPayment}
          searchableColumns={["labourName","workDescription"]} getRowKey={p => p.id}
        />
      </Card>
      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Payment</DialogTitle></DialogHeader>
            <LabourPaymentForm projects={projects} labours={labours} initialValues={editing} onSubmit={d => { updateLabourPayment(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
