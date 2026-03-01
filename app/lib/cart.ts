const CART_COOKIE = "cart";

export type CartItem = { product_id: string; quantity: number };

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${days * 24 * 60 * 60};SameSite=Lax`;
}

export function getCart(): CartItem[] {
  const raw = getCookie(CART_COOKIE);
  if (!raw) return [];
  try {
    const a = JSON.parse(raw) as unknown;
    return Array.isArray(a) ? a.filter((x): x is CartItem => x && typeof x === "object" && typeof (x as CartItem).product_id === "string") : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  setCookie(CART_COOKIE, JSON.stringify(items));
}

export function addToCart(productId: string, quantity: number) {
  const items = getCart();
  const i = items.findIndex((x) => x.product_id === productId);
  if (i >= 0) items[i].quantity += quantity;
  else items.push({ product_id: productId, quantity });
  setCart(items);
}

export function removeFromCart(productId: string) {
  setCart(getCart().filter((x) => x.product_id !== productId));
}

export function updateCartQty(productId: string, quantity: number) {
  const items = getCart();
  const i = items.findIndex((x) => x.product_id === productId);
  if (i < 0) return;
  if (quantity < 1) items.splice(i, 1);
  else items[i].quantity = quantity;
  setCart(items);
}

export function cartCount(): number {
  return getCart().reduce((n, x) => n + (x.quantity || 0), 0);
}
