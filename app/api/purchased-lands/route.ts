import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function map(r: any) {
  return {
    id: r.id,
    plotName: r.plot_name,
    plotNumber: r.plot_number,
    location: r.location,
    owner: r.owner,
    totalArea: parseFloat(r.total_area || 0),
    unit: r.unit || "marla",
    purchasePrice: parseFloat(r.purchase_price || 0),
    transferFee: parseFloat(r.transfer_fee || 0),
    totalCost: parseFloat(r.total_cost || 0),
    costPerUnit: parseFloat(r.cost_per_unit || 0),
    usedArea: parseFloat(r.used_area || 0),
    availableArea: parseFloat(r.available_area || 0),
    purchaseDate: r.purchase_date,
    status: r.status || "available",
    notes: r.notes,
    documents: r.documents || [],
    createdAt: r.created_at,
  };
}

function toDB(b: any) {
  return {
    plot_name: b.plotName,
    plot_number: b.plotNumber || null,
    location: b.location || null,
    owner: b.owner || null,
    total_area: b.totalArea,
    unit: b.unit || "marla",
    purchase_price: b.purchasePrice || 0,
    transfer_fee: b.transferFee || 0,
    purchase_date: b.purchaseDate || null,
    notes: b.notes || null,
    documents: b.documents || [],
  };
}

export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb
    .from("purchased_lands")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}

export async function POST(req: NextRequest) {
  const sb = await createClient();
  const body = await req.json();
  const { data, error } = await sb
    .from("purchased_lands")
    .insert([toDB(body)])
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
