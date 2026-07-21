import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { data, error } = await sb
    .from("project_cost_summary")
    .select("*")
    .eq("project_id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({
    projectId: data.project_id,
    projectName: data.project_name,
    landCost: parseFloat(data.land_cost || 0),
    materialCost: parseFloat(data.material_cost || 0),
    labourCost: parseFloat(data.labour_cost || 0),
    otherExpenses: parseFloat(data.other_expenses || 0),
    finalProjectCost: parseFloat(data.final_project_cost || 0),
  });
}
