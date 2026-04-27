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
    .from("likes")
    .select("count")
    .eq("post_slug", postSlug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data?.count ?? 0 });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const postSlug =
    typeof body === "object" && body !== null && "postSlug" in body
      ? String((body as { postSlug: unknown }).postSlug)
      : "";
  const deltaRaw =
    typeof body === "object" && body !== null && "delta" in body
      ? Number((body as { delta: unknown }).delta)
      : NaN;

  if (!postSlug || !slugPattern.test(postSlug)) {
    return NextResponse.json({ error: "Invalid postSlug" }, { status: 400 });
  }

  if (deltaRaw !== 1 && deltaRaw !== -1) {
    return NextResponse.json({ error: "delta must be 1 or -1" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: row, error: readErr } = await supabase
    .from("likes")
    .select("count")
    .eq("post_slug", postSlug)
    .maybeSingle();

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }

  const current = row?.count ?? 0;
  const newCount = Math.max(0, current + deltaRaw);

  const { error: writeErr } = await supabase.from("likes").upsert(
    {
      post_slug: postSlug,
      count: newCount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "post_slug" },
  );

  if (writeErr) {
    return NextResponse.json({ error: writeErr.message }, { status: 500 });
  }

  return NextResponse.json({ count: newCount });
}
