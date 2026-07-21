"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Search } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  render?: (value: any, row: T) => React.ReactNode
}
interface Props<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (id: string) => void
  searchableColumns?: string[]
  getRowKey: (item: T) => string
}

export function DataTable<T extends Record<string, any>>({ columns, data, onEdit, onDelete, searchableColumns = [], getRowKey }: Props<T>) {
  const [search, setSearch] = useState("")
  const filtered = search.trim()
    ? data.filter(row => searchableColumns.some(col => String(row[col] ?? "").toLowerCase().includes(search.toLowerCase())))
    : data

  return (
    <div className="space-y-4">
      {searchableColumns.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      )}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map(col => <th key={col.key} className="px-4 py-3 text-left font-medium text-muted-foreground">{col.label}</th>)}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">No records found.</td></tr>
              : filtered.map(row => (
                <tr key={getRowKey(row)} className="border-b hover:bg-muted/30 transition-colors">
                  {columns.map(col => <td key={col.key} className="px-4 py-3">{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}</td>)}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {onEdit && <Button size="sm" variant="outline" onClick={() => onEdit(row)} className="h-8 w-8 p-0"><Pencil className="h-3.5 w-3.5" /></Button>}
                        {onDelete && <Button size="sm" variant="outline" onClick={() => { if (confirm("Delete this record?")) onDelete(getRowKey(row)) }} className="h-8 w-8 p-0 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Showing {filtered.length} of {data.length} records</p>
    </div>
  )
}
