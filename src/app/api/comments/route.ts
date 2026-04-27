import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

const slugPattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,190}$/;

export async function GET(req: NextRequest) {
  const postSlug = req.nextUrl.searchParams.get("postSlug");
  if (!postSlug || !slugPattern.test(postSlug)) {
    return NextResponse.json({ error: "Invalid postSlug" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id, name, text, created_at")
    .eq("post_slug", postSlug)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const postSlug = typeof b.postSlug === "string" ? b.postSlug : "";
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const text = typeof b.text === "string" ? b.text.trim() : "";

  if (!postSlug || !slugPattern.test(postSlug)) {
    return NextResponse.json({ error: "Invalid postSlug" }, { status: 400 });
  }

  if (!name || !text) {
    return NextResponse.json({ error: "Name and text required" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { error } = await supabase.from("comments").insert({
    post_slug: postSlug,
    name,
    text,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
