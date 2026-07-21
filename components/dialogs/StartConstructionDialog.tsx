"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StartConstructionForm } from "@/components/forms/StartConstructionForm"
import { LandSale, Project } from "@/lib/types"
import { HardHat } from "lucide-react"

export function StartConstructionDialog({
  landSale, onStart, size = "sm",
}: {
  landSale: LandSale
  onStart: (landSaleId: string, projectData: any) => Promise<Project>
  size?: "sm" | "default"
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setError(null) }}>
      <DialogTrigger asChild>
        <Button size={size} variant="outline" className="gap-2"><HardHat className="h-3.5 w-3.5" />Start Construction</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Start Construction Project</DialogTitle></DialogHeader>
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
        <StartConstructionForm
          landSale={landSale}
          onSubmit={async d => {
            try {
              const project = await onStart(landSale.id, d)
              setOpen(false)
              router.push(`/projects/${project.id}`)
            } catch (e: any) {
              setError(e.message || "Failed to create construction project.")
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
