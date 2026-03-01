/**
 * API クライアント（Auth.js + プロキシ利用）
 * 認証が必要なリクエストは /api/proxy/* に送り、Cookie でセッションを渡します。
 */
const PROXY = "/api/proxy";

async function fetchProxy(path: string, options: RequestInit = {}) {
  const url = `${PROXY}/${path.replace(/^\//, "")}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const r = await fetch(url, { ...options, headers, credentials: "include" });
  if (r.status === 401) return { _unauthorized: true as const, response: r };
  return { response: r };
}

export async function getProducts() {
  const { response: r } = await fetchProxy("products");
  if (r.status === 401) return { _unauthorized: true as const };
  if (!r.ok) throw new Error(r.statusText || "Failed to fetch products");
  return r.json();
}

export async function getProduct(id: string) {
  const { response: r } = await fetchProxy(`products/${encodeURIComponent(id)}`);
  if (r.status === 401) return { _unauthorized: true as const };
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(r.statusText || "Failed to fetch product");
  return r.json();
}

function getBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

export async function getStores() {
  const base = getBase();
  const r = await fetch(base ? `${base}/api/stores` : `${PROXY}/stores`, { credentials: "include" });
  if (!r.ok) throw new Error(r.statusText || "Failed to fetch stores");
  return r.json();
}

export async function suggest(body: { mood?: string; allergies?: string[]; budget?: number }) {
  const { response: r } = await fetchProxy("suggest", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (r.status === 401) return { _unauthorized: true as const };
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error || r.statusText || "Suggest failed");
  }
  return r.json();
}

export async function createOrder(items: { product_id: string; quantity: number }[]) {
  const { response: r } = await fetchProxy("orders", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
  if (r.status === 401) return { _unauthorized: true as const };
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error || r.statusText || "Order failed");
  }
  return r.json();
}

export async function getMe() {
  const { response: r } = await fetchProxy("users/me");
  if (r.status === 401) return { _unauthorized: true as const };
  if (!r.ok) throw new Error(r.statusText || "Failed to fetch profile");
  return r.json();
}
