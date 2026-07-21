import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { DataProvider } from "@/lib/context/DataContext"
import { AppShell } from "@/components/layout/AppShell"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" })

export const metadata: Metadata = {
  title: "Buttar Builders & Developers - Construction Management",
  description: "Construction project management system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DataProvider>
            <AppShell>{children}</AppShell>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
