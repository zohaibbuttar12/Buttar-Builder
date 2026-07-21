"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginLanding() {
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80")' }} />
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-5xl rounded-[32px] border border-slate-200/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8 lg:flex lg:gap-8 lg:p-10">
          <div className="flex-1 rounded-[28px] border border-slate-200/10 bg-slate-900/80 p-8 text-white lg:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">BUTTAR BUILDER&apos;S &amp; DEVELOPER&apos;S</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Construction management access for approved administrators. Login to manage projects, investments, units, and site operations.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-400 sm:text-base">
              <p className="inline-flex items-center gap-2 text-[#D4AF37]">
                • Secure admin portal with backend auth
              </p>
              <p className="inline-flex items-center gap-2 text-[#D4AF37]">
                • Clean, responsive login view
              </p>
              <p className="inline-flex items-center gap-2 text-[#D4AF37]">
                • No scrolling landing page, simple access
              </p>
            </div>
          </div>

          <div className="mt-8 flex-1 rounded-[28px] border border-slate-200/10 bg-white/95 p-8 text-slate-950 shadow-xl shadow-slate-950/10 dark:bg-slate-950/95 dark:text-slate-100 lg:mt-0 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Admin Login</p>
            <h2 className="mt-4 text-3xl font-semibold">Access the dashboard</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Enter your admin credentials to manage the construction backend.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    placeholder="admin@buttarbuilders.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    placeholder="Enter password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#b38a2b] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? "Checking..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
