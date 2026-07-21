import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, projectId: r.project_id, category: r.category, description: r.description, vendorPerson: r.paid_to, amount: parseFloat(r.amount||0), date: r.expense_date, createdAt: r.created_at });
const toDB = (b: any) => ({ project_id: b.projectId, category: b.category, description: b.description, paid_to: b.vendorPerson, amount: b.amount, expense_date: b.date });
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("expenses").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient();
  const { data, error } = await sb.from("expenses").insert([toDB(await req.json())]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
