import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, projectId: r.project_id, partnerId: r.partner_id, partnerName: r.partners?.name || r.partner_name || "", sharePercent: parseFloat(r.share_percent||0), investedAmount: parseFloat(r.invested_amount||0), createdAt: r.created_at });
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient(); const b = await req.json();
  const { data, error } = await sb.from("project_partners").update({ project_id: b.projectId, partner_id: b.partnerId, share_percent: b.sharePercent, invested_amount: b.investedAmount||0, updated_at: new Date().toISOString() }).eq("id", params.id).select("*, partners(name)");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { error } = await sb.from("project_partners").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
