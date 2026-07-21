import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
function map(r: any) {
  const propertyCost = r.properties ? (parseFloat(r.properties.land_purchase_price||0) + parseFloat(r.properties.transfer_fees||0) + parseFloat(r.properties.total_construction_cost||0)) : 0;
  return { id: r.id, projectId: r.project_id, propertyId: r.property_id, propertyLabel: r.properties ? `${r.properties.property_type} - ${r.properties.plot_number}` : "", salePrice: parseFloat(r.sale_price||0), saleDate: r.sale_date, buyerName: r.buyer_name, buyerPhone: r.buyer_phone, paymentMode: r.payment_mode||"cash", notes: r.notes, propertyCost, profit: parseFloat(r.sale_price||0) - propertyCost, createdAt: r.created_at };
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient(); const b = await req.json();
  const { data, error } = await sb.from("sales").update({ project_id: b.projectId, property_id: b.propertyId, sale_price: b.salePrice, sale_date: b.saleDate, buyer_name: b.buyerName, buyer_phone: b.buyerPhone||null, payment_mode: b.paymentMode||"cash", notes: b.notes||null, updated_at: new Date().toISOString() }).eq("id", params.id).select("*, properties(plot_number, property_type, land_purchase_price, transfer_fees, total_construction_cost)");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  // Get the sale first to unmark property
  const { data: sale } = await sb.from("sales").select("property_id").eq("id", params.id).single();
  const { error } = await sb.from("sales").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (sale?.property_id) await sb.from("properties").update({ status: "available" }).eq("id", sale.property_id);
  return NextResponse.json({ success: true });
}
