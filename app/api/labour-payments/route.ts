import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, labourId: r.labour_id, labourName: r.labour_name||"", projectId: r.project_id, workDescription: r.description, amount: parseFloat(r.amount||0), date: r.payment_date, createdAt: r.created_at });
const toDB = (b: any) => ({ labour_id: b.labourId||null, labour_name: b.labourName, project_id: b.projectId, description: b.workDescription, amount: b.amount, payment_date: b.date });
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("labour_payments").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient();
  const { data, error } = await sb.from("labour_payments").insert([toDB(await req.json())]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
