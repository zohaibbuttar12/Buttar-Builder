import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface Props {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function SummaryCard({ title, value, icon: Icon, description }: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </Card>
  )
}
