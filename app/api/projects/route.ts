import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function map(r: any) {
  return {
    id: r.id, name: r.name, description: r.description,
    clientName: r.client_name, clientContact: r.client_contact,
    location: r.location, startDate: r.start_date, endDate: r.end_date,
    estimatedBudget: parseFloat(r.budget || 0), plotSize: r.plot_size,
    status: (r.status || "planning").toLowerCase(), createdAt: r.created_at,
    landSaleId: r.land_sale_id, purchasedLandId: r.purchased_land_id,
    contractAmount: parseFloat(r.contract_amount || 0),
  };
}
function toDB(b: any) {
  return {
    name: b.name, description: b.description, client_name: b.clientName,
    client_contact: b.clientContact, location: b.location,
    start_date: b.startDate, end_date: b.endDate, budget: b.estimatedBudget,
    plot_size: b.plotSize, status: b.status,
    land_sale_id: b.landSaleId || null, purchased_land_id: b.purchasedLandId || null,
    contract_amount: b.contractAmount || 0,
  };
}
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("projects").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient();
  const body = await req.json();
  const { data, error } = await sb.from("projects").insert([toDB(body)]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const project = data[0];

  // If this project was started from a Land Sale, link the sale back to it.
  if (body.landSaleId) {
    await sb.from("land_sales").update({
      project_id: project.id,
      construction_status: "construction_started",
      updated_at: new Date().toISOString(),
    }).eq("id", body.landSaleId);
  }

  return NextResponse.json(map(project), { status: 201 });
}
