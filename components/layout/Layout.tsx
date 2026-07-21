"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FolderOpen, Hammer, Banknote, Store, ShoppingCart,
  Wallet, BarChart3, Settings, Building2, Users, Home, TrendingUp, DollarSign, HandCoins
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { section: "Overview" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/investment", label: "Investment Dashboard", icon: TrendingUp },
  { href: "/reports", label: "Reports", icon: BarChart3 },

  { section: "Investment" },
  { href: "/partners", label: "Partners", icon: Users },
  { href: "/purchased-lands", label: "Purchased Lands", icon: Building2 },
  { href: "/land-sales", label: "Land Sales", icon: HandCoins },
  { href: "/properties", label: "Properties & Plots", icon: Home },
  { href: "/sales", label: "Sales & Revenue", icon: DollarSign },

  { section: "Construction" },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/labours", label: "Labour Workers", icon: Hammer },
  { href: "/labour-payments", label: "Labour Payments", icon: Banknote },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/material-purchases", label: "Material Purchases", icon: ShoppingCart },
  { href: "/expenses", label: "Expenses", icon: Wallet },

  { section: "System" },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/units", label: "Units", icon: Building2 },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">Buttar Builders</p>
            <p className="text-xs text-muted-foreground mt-0.5">& Developers</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {nav.map((item, i) => {
            if ("section" in item) {
              return (
                <p key={i} className="px-3 pt-4 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {item.section}
                </p>
              )
            }
            const { href, label, icon: Icon } = item as any
            const active = pathname === href || (href !== "/" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-5 py-3 border-t">
          <p className="text-xs text-muted-foreground">© 2025 Buttar Builders</p>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-6 min-h-screen">{children}</main>
    </div>
  )
}
