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

export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb
    .from("land_sales")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}

export async function POST(req: NextRequest) {
  const sb = await createClient();
  const b = await req.json();

  if (!b.purchasedLandId) return NextResponse.json({ error: "A purchased land plot is required." }, { status: 400 });
  if (!b.customerName) return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
  if (!b.areaSold || Number(b.areaSold) <= 0) return NextResponse.json({ error: "Area sold must be greater than 0." }, { status: 400 });

  // Lock in the plot's current cost-per-unit and validate availability
  const { data: plot, error: plotErr } = await sb
    .from("purchased_lands")
    .select("cost_per_unit, available_area, unit, purchase_date")
    .eq("id", b.purchasedLandId)
    .single();
  if (plotErr || !plot) return NextResponse.json({ error: "Selected plot not found." }, { status: 404 });
  if (Number(b.areaSold) > Number(plot.available_area)) {
    return NextResponse.json(
      { error: `Only ${plot.available_area} ${plot.unit} available on this plot — cannot sell ${b.areaSold}.` },
      { status: 400 }
    );
  }

  const { data, error } = await sb
    .from("land_sales")
    .insert([{
      purchased_land_id: b.purchasedLandId,
      customer_name: b.customerName,
      customer_phone: b.customerPhone || null,
      area_sold: b.areaSold,
      unit: b.unit || plot.unit || "marla",
      sale_price: b.salePrice || 0,
      cost_per_unit_snapshot: plot.cost_per_unit,
      purchase_date_snapshot: plot.purchase_date || null,
      sale_date: b.saleDate || new Date().toISOString().split("T")[0],
      payment_mode: b.paymentMode || "cash",
      notes: b.notes || null,
      construction_status: "no_construction",
    }])
    .select(SELECT);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
