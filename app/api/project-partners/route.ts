import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, projectId: r.project_id, partnerId: r.partner_id, partnerName: r.partners?.name || r.partner_name || "", sharePercent: parseFloat(r.share_percent||0), investedAmount: parseFloat(r.invested_amount||0), createdAt: r.created_at });
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("project_partners").select("*, partners(name)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient(); const b = await req.json();
  const { data, error } = await sb.from("project_partners").insert([{ project_id: b.projectId, partner_id: b.partnerId, partner_name: b.partnerName||null, share_percent: b.sharePercent, invested_amount: b.investedAmount||0 }]).select("*, partners(name)");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
