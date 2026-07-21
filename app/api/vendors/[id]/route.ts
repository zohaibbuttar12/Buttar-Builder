import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const map = (r: any) => ({ id: r.id, shopName: r.name, ownerName: r.contact_person, materialType: r.material_type, phone: r.phone_number, address: r.address, createdAt: r.created_at });
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient(); const b = await req.json();
  const { data, error } = await sb.from("vendors").update({ name: b.shopName, contact_person: b.ownerName, material_type: b.materialType, phone_number: b.phone, address: b.address, updated_at: new Date().toISOString() }).eq("id", params.id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { error } = await sb.from("vendors").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
