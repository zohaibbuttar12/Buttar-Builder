import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body.password === "string" ? body.password.trim() : ""

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const envPassword = process.env.ADMIN_PASSWORD?.trim()

  if (envEmail && envPassword && email === envEmail && password === envPassword) {
    return NextResponse.json({ success: true })
  }

  const sb = await createClient()
  const { data, error } = await sb.from("admins").select("id, email, password").eq("email", email).maybeSingle()

  if (error) {
    const message = String(error.message || "")
    const isMissingTable = error.code === "42P01" || message.toLowerCase().includes("does not exist")

    if (isMissingTable) {
      return NextResponse.json({ error: "Admin login is not configured yet. Please create the admins table or set ADMIN_EMAIL and ADMIN_PASSWORD." }, { status: 500 })
    }

    console.error("Supabase auth error:", error)
    return NextResponse.json({ error: message || "Unable to verify credentials." }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "No admin record found for this email." }, { status: 401 })
  }

  if (data.password !== password) {
    return NextResponse.json({ error: "Password does not match the stored admin password." }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
