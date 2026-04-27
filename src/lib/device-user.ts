const STORAGE_KEY = "blog-device-user-key";

/** Stable anonymous id for this browser (replace with auth user id when you add login). */
export function getOrCreateDeviceUserKey(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let key = localStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}
