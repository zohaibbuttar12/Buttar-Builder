"use client"
import { useState } from "react"
import { useData } from "@/lib/context/DataContext"
import { DataTable } from "@/components/tables/DataTable"
import { AddExpenseDialog } from "@/components/dialogs/AddExpenseDialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExpenseForm } from "@/components/forms/ExpenseForm"
import { Expense } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const catColor: Record<string,string> = { transport:"bg-blue-100 text-blue-800", loading:"bg-green-100 text-green-800", unloading:"bg-orange-100 text-orange-800", "equipment-rent":"bg-purple-100 text-purple-800", miscellaneous:"bg-gray-100 text-gray-800" }
const catLabel: Record<string,string> = { transport:"Transport", loading:"Loading", unloading:"Unloading", "equipment-rent":"Equipment Rental", miscellaneous:"Miscellaneous" }

export default function ExpensesPage() {
  const { expenses, projects, addExpense, updateExpense, deleteExpense } = useData()
  const [editing, setEditing] = useState<Expense|null>(null)
  const getProject = (id: string) => projects.find(p => p.id === id)?.name || "—"
  const total = expenses.reduce((s,e) => s+e.amount, 0)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Expenses</h1><p className="text-muted-foreground mt-1">Track operational expenses</p></div>
        <AddExpenseDialog projects={projects} onAdd={addExpense} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6"><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold mt-1">{formatCurrency(total)}</p></Card>
        <Card className="p-6"><p className="text-sm text-muted-foreground">Total Records</p><p className="text-2xl font-bold mt-1">{expenses.length}</p></Card>
      </div>
      <Card className="p-6">
        <DataTable
          columns={[
            { key:"category", label:"Category", render: v => <span className={`px-2 py-1 rounded-full text-xs font-medium ${catColor[v]||"bg-gray-100 text-gray-800"}`}>{catLabel[v]||v}</span> },
            { key:"projectId", label:"Project", render: v => getProject(v) },
            { key:"description", label:"Description" },
            { key:"vendorPerson", label:"Paid To" },
            { key:"date", label:"Date", render: v => formatDate(v) },
            { key:"amount", label:"Amount", render: v => formatCurrency(v) },
          ]}
          data={expenses} onEdit={setEditing} onDelete={deleteExpense}
          searchableColumns={["description","vendorPerson"]} getRowKey={e => e.id}
        />
      </Card>
      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Expense</DialogTitle></DialogHeader>
            <ExpenseForm projects={projects} initialValues={editing} onSubmit={d => { updateExpense(editing.id, d); setEditing(null) }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
