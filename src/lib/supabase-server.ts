import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. Uses non-public env first so Route Handlers
 * pick up credentials from the host at runtime (Vercel) without relying on
 * client bundle build-time inlining of NEXT_PUBLIC_*.
 */
export function createSupabaseServerClient(): SupabaseClient | null {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}
