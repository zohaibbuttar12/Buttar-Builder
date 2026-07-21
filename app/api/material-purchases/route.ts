import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, projectId: r.project_id, vendorId: r.vendor_id, vendorName: r.vendor_name||"", materialType: r.material_name, quantity: parseFloat(r.quantity||0), unit: r.unit, rate: parseFloat(r.unit_price||0), total: parseFloat(r.total_price||0), date: r.purchase_date, createdAt: r.created_at });
const toDB = (b: any) => ({ project_id: b.projectId, vendor_id: b.vendorId||null, vendor_name: b.vendorName, material_name: b.materialType, quantity: b.quantity, unit: b.unit, unit_price: b.rate, total_price: b.total||(b.quantity*b.rate), purchase_date: b.date });
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("material_purchases").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient();
  const { data, error } = await sb.from("material_purchases").insert([toDB(await req.json())]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
