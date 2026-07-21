import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
function map(r: any) {
  const landCost = parseFloat(r.land_purchase_price||0) + parseFloat(r.transfer_fees||0);
  const constCost = parseFloat(r.total_construction_cost||0) || (parseFloat(r.construction_area||0) * parseFloat(r.construction_cost_per_sqft||0));
  return { id: r.id, projectId: r.project_id, plotNumber: r.plot_number, propertyType: r.property_type, landArea: parseFloat(r.land_area||0), landUnit: r.land_unit||"marla", landPurchasePrice: parseFloat(r.land_purchase_price||0), transferFees: parseFloat(r.transfer_fees||0), purchaseDate: r.purchase_date, constructionType: r.construction_type||"none", constructionArea: parseFloat(r.construction_area||0), constructionCostPerSqFt: parseFloat(r.construction_cost_per_sqft||0), totalConstructionCost: constCost, constructionStage: r.construction_stage||"not-started", totalCost: landCost + constCost, status: r.status||"available", notes: r.notes, createdAt: r.created_at };
}
function toDB(b: any) {
  const constCost = b.totalConstructionCost || (parseFloat(b.constructionArea||0) * parseFloat(b.constructionCostPerSqFt||0));
  return { project_id: b.projectId, plot_number: b.plotNumber, property_type: b.propertyType, land_area: b.landArea, land_unit: b.landUnit||"marla", land_purchase_price: b.landPurchasePrice||0, transfer_fees: b.transferFees||0, purchase_date: b.purchaseDate, construction_type: b.constructionType||"none", construction_area: b.constructionArea||null, construction_cost_per_sqft: b.constructionCostPerSqFt||null, total_construction_cost: constCost||null, construction_stage: b.constructionStage||"not-started", status: b.status||"available", notes: b.notes||null };
}
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("properties").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient();
  const { data, error } = await sb.from("properties").insert([toDB(await req.json())]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
