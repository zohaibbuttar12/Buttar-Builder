import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const map = (r: any) => ({
  id: r.id,
  name: r.name,
  description: r.description || "",
  isActive: r.is_active ?? true,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toDB = (b: any) => ({
  name: b.name?.trim(),
  description: b.description?.trim() || "",
  is_active: b.isActive ?? true,
});

export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("worker_categories").select("*").order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data || []).map(map));
}

export async function POST(req: NextRequest) {
  const sb = await createClient();
  const body = await req.json();
  const name = String(body.name || "").trim();

  if (!name) return NextResponse.json({ error: "Category name is required." }, { status: 400 });

  const { data: existing } = await sb.from("worker_categories").select("id").ilike("name", name).limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "A category with this name already exists." }, { status: 409 });
  }

  const { data, error } = await sb.from("worker_categories").insert([toDB(body)]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]), { status: 201 });
}
