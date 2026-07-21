import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function map(r: any) {
  return {
    id: r.id,
    purchasedLandId: r.purchased_land_id,
    plotName: r.purchased_lands?.plot_name,
    plotNumber: r.purchased_lands?.plot_number,
    plotLocation: r.purchased_lands?.location,
    customerName: r.customer_name,
    customerPhone: r.customer_phone,
    areaSold: parseFloat(r.area_sold || 0),
    unit: r.unit || "marla",
    salePrice: parseFloat(r.sale_price || 0),
    costPerUnitSnapshot: parseFloat(r.cost_per_unit_snapshot || 0),
    landPurchaseCost: parseFloat(r.land_purchase_cost || 0),
    landProfit: parseFloat(r.land_profit || 0),
    purchaseDate: r.purchase_date_snapshot,
    saleDate: r.sale_date,
    paymentMode: r.payment_mode || "cash",
    notes: r.notes,
    constructionStatus: r.construction_status || "no_construction",
    projectId: r.project_id,
    projectName: r.projects?.name,
    createdAt: r.created_at,
  };
}

const SELECT = "*, purchased_lands(plot_name, plot_number, location), projects(name)";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { data, error } = await sb.from("land_sales").select(SELECT).eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(map(data));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const b = await req.json();
  const patch: any = { updated_at: new Date().toISOString() };
  if (b.customerName !== undefined) patch.customer_name = b.customerName;
  if (b.customerPhone !== undefined) patch.customer_phone = b.customerPhone;
  if (b.salePrice !== undefined) patch.sale_price = b.salePrice;
  if (b.saleDate !== undefined) patch.sale_date = b.saleDate;
  if (b.paymentMode !== undefined) patch.payment_mode = b.paymentMode;
  if (b.notes !== undefined) patch.notes = b.notes;
  if (b.constructionStatus !== undefined) patch.construction_status = b.constructionStatus;
  if (b.projectId !== undefined) patch.project_id = b.projectId || null;

  const { data, error } = await sb.from("land_sales").update(patch).eq("id", params.id).select(SELECT);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { data: sale } = await sb.from("land_sales").select("project_id").eq("id", params.id).single();
  if (sale?.project_id) {
    return NextResponse.json(
      { error: "Cannot delete this land sale — a Construction Project is already linked to it." },
      { status: 400 }
    );
  }
  const { error } = await sb.from("land_sales").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
