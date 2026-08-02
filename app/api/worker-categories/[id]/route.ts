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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const { data, error } = await sb.from("worker_categories").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(map(data));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();
  const body = await req.json();
  const name = String(body.name || "").trim();

  if (!name) return NextResponse.json({ error: "Category name is required." }, { status: 400 });

  const { data: existing } = await sb.from("worker_categories").select("id").ilike("name", name).neq("id", params.id).limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "A category with this name already exists." }, { status: 409 });
  }

  const payload: any = {
    name,
    description: (body.description ?? "").toString().trim(),
    is_active: body.isActive ?? true,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("worker_categories").update(payload).eq("id", params.id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(map(data[0]));
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createClient();

  const { data: workerCheck } = await sb.from("labours").select("id").eq("category", params.id).limit(1);
  if (workerCheck && workerCheck.length > 0) {
    return NextResponse.json({ error: "This category cannot be deleted because workers are assigned to it." }, { status: 400 });
  }

  const { error } = await sb.from("worker_categories").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
