import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const slugPattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,190}$/;

function parsePostId(params: { postId: string }) {
  return decodeURIComponent(params.postId);
}

/** GET ?userKey= — total likes + whether this device already liked */
export async function GET(
  req: NextRequest,
  context: { params: { postId: string } },
) {
  const postId = parsePostId(context.params);
  if (!slugPattern.test(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const userKey = req.nextUrl.searchParams.get("userKey") ?? "";

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase server env not configured" }, { status: 503 });
  }

  const { count: total, error: countErr } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (countErr) {
    return NextResponse.json({ error: countErr.message }, { status: 500 });
  }

  let likedByMe = false;
  if (userKey.length > 0) {
    const { data: row, error: likeErr } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_key", userKey)
      .maybeSingle();

    if (likeErr) {
      return NextResponse.json({ error: likeErr.message }, { status: 500 });
    }
    likedByMe = Boolean(row);
  }

  return NextResponse.json({
    count: total ?? 0,
    likedByMe,
  });
}

/** POST { userKey } — toggle like for this post + device */
export async function POST(
  req: NextRequest,
  context: { params: { postId: string } },
) {
  const postId = parsePostId(context.params);
  if (!slugPattern.test(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userKey =
    typeof body === "object" && body !== null && "userKey" in body
      ? String((body as { userKey: unknown }).userKey).trim()
      : "";

  if (!userKey || userKey.length > 200) {
    return NextResponse.json({ error: "userKey required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase server env not configured" }, { status: 503 });
  }

  const { data: existing, error: findErr } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_key", userKey)
    .maybeSingle();

  if (findErr) {
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }

  if (existing?.id) {
    const { error: delErr } = await supabase.from("post_likes").delete().eq("id", existing.id);
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }
  } else {
    const { error: insErr } = await supabase.from("post_likes").insert({
      post_id: postId,
      user_key: userKey,
    });
    if (insErr) {
      if (insErr.code === "23505") {
        return NextResponse.json({ error: "Already liked" }, { status: 409 });
      }
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }
  }

  const { count: exact, error: c2 } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (c2) {
    return NextResponse.json({ error: c2.message }, { status: 500 });
  }

  const { data: still } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_key", userKey)
    .maybeSingle();

  return NextResponse.json({
    count: exact ?? 0,
    likedByMe: Boolean(still?.id),
  });
}
