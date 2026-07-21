"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result.error || "Invalid email or password.")
        setLoading(false)
        return
      }

      window.localStorage.setItem("buttar_admin_auth", "true")
      router.replace("/dashboard")
    } catch (err) {
      setError("Unable to reach the server. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.2),_transparent_35%)] px-4 py-10 text-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-slate-950 p-8 text-white lg:p-12">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold">BUTTAR BUILDER&apos;S &amp; DEVELOPER&apos;S</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Secure admin access to the construction management platform. Manage projects, investments, units, and delivery operations.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Authorized access only</p>
            <p className="mt-2">Use your admin credentials to continue to the dashboard.</p>
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Admin Login</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
            </div>
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-[#D4AF37] dark:text-slate-300">Back home</Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <Mail className="h-4 w-4 text-slate-500" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" placeholder="admin@buttarbuilders.com" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <Lock className="h-4 w-4 text-slate-500" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><input type="checkbox" className="rounded border-slate-300" /> Remember me</label>
              <a href="#" className="text-[#D4AF37]">Forgot password?</a>
            </div>
            {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#D4AF37] px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Checking..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
