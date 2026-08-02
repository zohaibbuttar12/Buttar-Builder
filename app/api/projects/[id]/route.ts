import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function hasProjectContractAmountColumn(sb: any) {
  try {
    const { error } = await sb.from("projects").select("contract_amount").limit(1);
    return !error;
  } catch {
    return false;
  }
}

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
function toDB(b: any, includeContractAmount = true) {
  const out: any = {
    name: b.name, description: b.description, client_name: b.clientName,
    client_contact: b.clientContact, location: b.location,
    start_date: b.startDate, end_date: b.endDate, budget: b.estimatedBudget,
    plot_size: b.plotSize, status: b.status, updated_at: new Date().toISOString(),
  };
  if (includeContractAmount && b.contractAmount !== undefined) out.contract_amount = b.contractAmount;
  if (b.landSaleId !== undefined) out.land_sale_id = b.landSaleId || null;
  if (b.purchasedLandId !== undefined) out.purchased_land_id = b.purchasedLandId || null;
  return out;
}
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { data, error } = await sb.from("projects").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(map(data));
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const includeContractAmount = await hasProjectContractAmountColumn(sb);
  const body = await req.json();
  const { data, error } = await sb.from("projects").update(toDB(body, includeContractAmount)).eq("id", params.id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { error } = await sb.from("projects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
