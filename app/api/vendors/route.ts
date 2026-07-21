import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, shopName: r.name, ownerName: r.contact_person, materialType: r.material_type, phone: r.phone_number, address: r.address, createdAt: r.created_at });
const toDB = (b: any) => ({ name: b.shopName, contact_person: b.ownerName, material_type: b.materialType, phone_number: b.phone, address: b.address });
export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("vendors").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(map));
}
export async function POST(req: NextRequest) {
  const sb = await createClient();
  const { data, error } = await sb.from("vendors").insert([toDB(await req.json())]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
