"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProduct, createOrder } from "@/lib/api";
import { getMockProduct } from "@/data/products";
import { getCart, setCart, removeFromCart, updateCartQty } from "@/lib/cart";

type CartItem = { product_id: string; quantity: number };
type ProductRes = { Product?: { id?: string; name?: string; price?: number }; Inventory?: { discount_rate?: number } };

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<{ item: CartItem; name: string; priceAfter: number; sub: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    const raw = getCart();
    if (raw.length === 0) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    const results = await Promise.all(
      raw.map(async (item) => {
        let p = (await getProduct(item.product_id)) as ProductRes | null;
        if (!p || "_unauthorized" in p) p = getMockProduct(item.product_id) as ProductRes | null;
        if (!p) return null;
        const prod = p.Product ?? {};
        const inv = p.Inventory ?? {};
        const price = prod.price ?? 0;
        const discount = inv.discount_rate ?? 0;
        const priceAfter = Math.floor(price * (100 - discount) / 100);
        const sub = priceAfter * (item.quantity || 0);
        return { item, name: prod.name ?? "", priceAfter, sub };
      })
    );
    const valid = results.filter((r): r is NonNullable<typeof r> => r !== null);
    setItems(valid);
    setTotal(valid.reduce((s, r) => s + r.sub, 0));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    load();
  };

  const handleQtyChange = (productId: string, qty: number) => {
    updateCartQty(productId, Math.max(1, qty));
    load();
  };

  const handleOrder = async () => {
    const raw = getCart();
    if (raw.length === 0) return;
    setOrderLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await createOrder(raw);
      if (res && typeof res === "object" && "_unauthorized" in res) {
        router.replace("/auth/login");
        return;
      }
      setCart([]);
      setSuccess("注文を受け付けました。");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "注文に失敗しました");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <p className="text-gray-600">読み込み中…</p>;

  return (
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-xl font-bold mb-4">カート</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">カートは空です。</p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {items.map(({ item, name, priceAfter, sub }) => (
              <div key={item.product_id} className="border border-gray-200 rounded-lg p-4 flex flex-wrap justify-between items-center gap-2">
                <span className="font-semibold">{name}</span>
                <span>{priceAfter}円 × </span>
                <span className="flex items-center gap-1">
                  <button type="button" onClick={() => handleQtyChange(item.product_id, item.quantity - 1)} className="w-8 h-8 rounded border">−</button>
                  <input type="number" min={1} value={item.quantity} onChange={(e) => handleQtyChange(item.product_id, parseInt(e.target.value, 10) || 1)} className="w-12 text-center border rounded" />
                  <button type="button" onClick={() => handleQtyChange(item.product_id, item.quantity + 1)} className="w-8 h-8 rounded border">+</button>
                </span>
                <span>{sub}円</span>
                <button type="button" onClick={() => handleRemove(item.product_id)} className="text-red-600 text-sm">削除</button>
              </div>
            ))}
          </div>
          <p className="text-lg font-semibold">合計: <strong>{total}</strong>円</p>
          <button type="button" onClick={handleOrder} disabled={orderLoading} className="mt-4 py-3 px-6 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-60">
            {orderLoading ? "送信中…" : "注文する"}
          </button>
        </>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {success && <p className="mt-4 text-green-600">{success}</p>}
    </div>
  );
}
