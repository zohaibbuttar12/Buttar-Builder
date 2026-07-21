import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, name: r.name, phone: r.phone, email: r.email, cnic: r.cnic, address: r.address, notes: r.notes, createdAt: r.created_at });
const toDB = (b: any) => ({ name: b.name, phone: b.phone, email: b.email||null, cnic: b.cnic||null, address: b.address||null, notes: b.notes||null });
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("partners").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient();
  const { data, error } = await sb.from("partners").insert([toDB(await req.json())]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
