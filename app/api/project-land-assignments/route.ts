import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function map(r: any) {
  return {
    id: r.id,
    projectId: r.project_id,
    purchasedLandId: r.purchased_land_id,
    plotName: r.purchased_lands?.plot_name,
    areaUsed: parseFloat(r.area_used || 0),
    costPerUnitSnapshot: parseFloat(r.cost_per_unit_snapshot || 0),
    landCost: parseFloat(r.land_cost || 0),
    assignedDate: r.assigned_date,
    notes: r.notes,
    createdAt: r.created_at,
  };
}

export async function GET(req: NextRequest) {
  const sb = await createClient();
  const projectId = req.nextUrl.searchParams.get("projectId");
  let query = sb
    .from("project_land_assignments")
    .select("*, purchased_lands(plot_name)")
    .order("created_at", { ascending: false });
  if (projectId) query = query.eq("project_id", projectId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}

export async function POST(req: NextRequest) {
  const sb = await createClient();
  const b = await req.json();

  // Look up the plot's current cost-per-unit to lock it in on this assignment
  const { data: plot, error: plotErr } = await sb
    .from("purchased_lands")
    .select("cost_per_unit, available_area, total_area")
    .eq("id", b.purchasedLandId)
    .single();
  if (plotErr || !plot) {
    return NextResponse.json({ error: "Selected plot not found." }, { status: 404 });
  }
  if (Number(b.areaUsed) > Number(plot.available_area)) {
    return NextResponse.json(
      { error: `Only ${plot.available_area} available on this plot — cannot assign ${b.areaUsed}.` },
      { status: 400 }
    );
  }

  const { data, error } = await sb
    .from("project_land_assignments")
    .insert([{
      project_id: b.projectId,
      purchased_land_id: b.purchasedLandId,
      area_used: b.areaUsed,
      cost_per_unit_snapshot: plot.cost_per_unit,
      assigned_date: b.assignedDate || new Date().toISOString().split("T")[0],
      notes: b.notes || null,
    }])
    .select("*, purchased_lands(plot_name)");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
