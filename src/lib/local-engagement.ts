/** Browser-only fallback when Supabase is not configured on the server. */

export function localLikeCountKey(postSlug: string) {
  return `blog-local-like-count:${postSlug}`;
}

export function localCommentsKey(postSlug: string) {
  return `blog-local-comments:${postSlug}`;
}

export type LocalComment = {
  id: string;
  name: string;
  text: string;
  createdAt: string;
};

export function readLocalLikeCount(postSlug: string): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(localLikeCountKey(postSlug));
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function writeLocalLikeCount(postSlug: string, count: number) {
  localStorage.setItem(localLikeCountKey(postSlug), String(Math.max(0, count)));
}

export function readLocalComments(postSlug: string): LocalComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(localCommentsKey(postSlug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is LocalComment =>
          typeof x === "object" &&
          x !== null &&
          typeof (x as LocalComment).name === "string" &&
          typeof (x as LocalComment).text === "string",
      )
      .map((c, i) => ({
        id: typeof c.id === "string" ? c.id : `local-${i}-${c.createdAt ?? ""}`,
        name: c.name,
        text: c.text,
        createdAt: typeof c.createdAt === "string" ? c.createdAt : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export function appendLocalComment(postSlug: string, name: string, text: string) {
  const list = readLocalComments(postSlug);
  const entry: LocalComment = {
    id: `local-${Date.now()}`,
    name,
    text,
    createdAt: new Date().toISOString(),
  };
  list.push(entry);
  localStorage.setItem(localCommentsKey(postSlug), JSON.stringify(list));
  return entry;
}
