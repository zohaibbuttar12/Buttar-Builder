"use client"

import Link from "next/link"
import { useData } from "@/lib/context/DataContext"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react"

export default function UnitsPage() {
  const { properties, partners } = useData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Units</h1>
          <p className="text-muted-foreground mt-1">Professional unit portfolio and delivery visibility</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => {
          const owner = partners.find((partner) => partner.id === property.projectId)
          return (
            <Card key={property.id} className="overflow-hidden p-0">
              <div className="bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">Unit</p>
                    <h2 className="mt-2 text-xl font-semibold">{property.plotNumber || "Premium Unit"}</h2>
                  </div>
                  <div className="rounded-full bg-[#D4AF37]/10 p-2 text-[#D4AF37]">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                  <span>{property.status}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between"><span>Owner</span><span className="font-semibold text-slate-900 dark:text-white">{owner?.name || "Investor"}</span></div>
                  <div className="flex justify-between"><span>Budget</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(property.landPurchasePrice + (property.totalConstructionCost || 0))}</span></div>
                  <div className="flex justify-between"><span>Location</span><span className="font-semibold text-slate-900 dark:text-white">Lahore</span></div>
                </div>
                <Link href={`/units/${property.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37]">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
