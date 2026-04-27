import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl.length > 0 && supabaseKey.length > 0,
);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder",
);

export type Like = {
  post_slug: string;
  count: number;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_slug: string;
  name: string;
  text: string;
  created_at: string;
};
