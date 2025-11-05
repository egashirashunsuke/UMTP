export function getAnonId(): string | null {
  if (typeof window === "undefined") return null; // SSR
  const k = "anon_id";
  let v = window.localStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    window.localStorage.setItem(k, v);
  }
  return v;
}
