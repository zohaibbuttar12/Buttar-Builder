import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  const sb = await createClient()
  const { data, error } = await sb.from("admins").select("id, email, password").eq("email", email).maybeSingle()

  if (error) {
    console.error("Supabase auth error:", error)
    return NextResponse.json({ error: error.message || "Unable to verify credentials." }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "No admin record found for this email." }, { status: 401 })
  }

  if (data.password !== password) {
    return NextResponse.json({ error: "Password does not match the stored admin password." }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
