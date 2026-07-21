import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, projectId: r.project_id, vendorId: r.vendor_id, vendorName: r.vendor_name||"", materialType: r.material_name, quantity: parseFloat(r.quantity||0), unit: r.unit, rate: parseFloat(r.unit_price||0), total: parseFloat(r.total_price||0), date: r.purchase_date, createdAt: r.created_at });
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient(); const b = await req.json();
  const { data, error } = await sb.from("material_purchases").update({ project_id: b.projectId, vendor_id: b.vendorId||null, vendor_name: b.vendorName, material_name: b.materialType, quantity: b.quantity, unit: b.unit, unit_price: b.rate, total_price: b.total||(b.quantity*b.rate), purchase_date: b.date, updated_at: new Date().toISOString() }).eq("id", params.id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { error } = await sb.from("material_purchases").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
