import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const slugPattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,190}$/;

function parsePostId(params: { postId: string }) {
  return decodeURIComponent(params.postId);
}

export async function GET(
  _req: NextRequest,
  context: { params: { postId: string } },
) {
  const postId = parsePostId(context.params);
  if (!slugPattern.test(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase server env not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("post_comments")
    .select("id, author_name, body, created_at, user_key")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

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

  const b = body as Record<string, unknown>;
  const text =
    typeof b.comment === "string" ? b.comment.trim() : typeof b.text === "string" ? b.text.trim() : "";
  const authorName =
    typeof b.authorName === "string"
      ? b.authorName.trim()
      : typeof b.name === "string"
        ? b.name.trim()
        : "";
  const userKey =
    typeof b.userKey === "string" ? b.userKey.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "comment or text required" }, { status: 400 });
  }

  if (text.length > 2000) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase server env not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      user_key: userKey.length > 0 ? userKey : null,
      author_name: authorName.length > 0 ? authorName : "Anonymous",
      body: text,
    })
    .select("id, author_name, body, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}
