import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, labourId: r.labour_id, labourName: r.labour_name||"", projectId: r.project_id, workDescription: r.description, amount: parseFloat(r.amount||0), date: r.payment_date, createdAt: r.created_at });
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient(); const b = await req.json();
  const { data, error } = await sb.from("labour_payments").update({ labour_id: b.labourId||null, labour_name: b.labourName, project_id: b.projectId, description: b.workDescription, amount: b.amount, payment_date: b.date, updated_at: new Date().toISOString() }).eq("id", params.id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { error } = await sb.from("labour_payments").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
