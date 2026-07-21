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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { data, error } = await sb.from("purchased_lands").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(map(data));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const b = await req.json();
  const { data, error } = await sb
    .from("purchased_lands")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  // Guard: don't allow deleting a plot that still has active assignments
  const { data: assignments } = await sb
    .from("project_land_assignments")
    .select("id")
    .eq("purchased_land_id", params.id)
    .limit(1);
  if (assignments && assignments.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete this plot — it is still assigned to one or more projects." },
      { status: 400 }
    );
  }
  const { error } = await sb.from("purchased_lands").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
