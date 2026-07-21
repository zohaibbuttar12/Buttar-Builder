"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Layout } from "@/components/layout/Layout"

const protectedPrefixes = [
  "/dashboard",
  "/investment",
  "/projects",
  "/labours",
  "/labour-payments",
  "/vendors",
  "/material-purchases",
  "/expenses",
  "/partners",
  "/properties",
  "/purchased-lands",
  "/land-sales",
  "/sales",
  "/settings",
  "/units",
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const auth = typeof window !== "undefined" ? window.localStorage.getItem("buttar_admin_auth") : null
    const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
    if (isProtected && auth !== "true") {
      router.replace("/login")
      return
    }
    setReady(true)
  }, [pathname, router])

  if (!ready) {
    return <div className="min-h-screen bg-background" />
  }

  const isPublicRoute = pathname === "/" || pathname === "/login"
  if (isPublicRoute) {
    return <>{children}</>
  }

  return <Layout>{children}</Layout>
}
