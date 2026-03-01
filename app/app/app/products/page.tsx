"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import { getMockProductsResponse } from "@/data/products";
import { addToCart, cartCount } from "@/lib/cart";

type ProductRow = {
  Product?: { id?: string; name?: string; price?: number };
  Inventory?: { stock?: number; discount_rate?: number; expires_at?: string };
  Store?: { name?: string };
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    getProducts()
      .then((res: unknown) => {
        if (res && typeof res === "object" && "_unauthorized" in res) {
          router.replace("/auth/login");
          return;
        }
        const data = res as { products?: ProductRow[] };
        const list = data?.products ?? [];
        setProducts(list.length > 0 ? list : getMockProductsResponse().products);
        setError(null);
      })
      .catch(() => {
        setProducts(getMockProductsResponse().products);
        setError(null);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const filteredProducts = useMemo(() => {
    if (!q.trim()) return products;
    const lower = q.trim().toLowerCase();
    return products.filter((p) => {
      const name = (p.Product?.name ?? "").toLowerCase();
      const store = (p.Store?.name ?? "").toLowerCase();
      return name.includes(lower) || store.includes(lower);
    });
  }, [products, q]);

  const handleAddCart = (id: string) => {
    addToCart(id, 1);
    if (typeof window !== "undefined" && document.querySelector("[aria-label='カート']")) {
      const badge = document.querySelector("[aria-label='カート']")?.nextElementSibling ?? document.querySelector(".bg-blue-600.text-white");
      if (badge) (badge as HTMLElement).textContent = String(cartCount());
    }
    alert("カートに追加しました");
  };

  if (loading) return <p className="text-gray-600">読み込み中…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (products.length === 0) return <p>商品はありません</p>;

  return (
    <div className="max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold mb-4">商品一覧</h1>
      {q && (
        <p className="text-gray-500 text-sm mb-2">「{q}」で検索: {filteredProducts.length}件</p>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {filteredProducts.map((p) => {
          const prod = p.Product ?? {};
          const inv = p.Inventory ?? {};
          const store = p.Store ?? {};
          const price = prod.price ?? 0;
          const discount = inv.discount_rate ?? 0;
          const priceAfter = Math.floor(price * (100 - discount) / 100);
          const expires = inv.expires_at ? new Date(inv.expires_at).toLocaleString("ja-JP") : "-";
          const id = prod.id ?? "";
          return (
            <div key={id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="font-semibold mb-1">{prod.name ?? ""}</h3>
              <p className="text-gray-500 text-sm mb-1">{store.name ?? ""} · 残り {inv.stock ?? 0}</p>
              <p className="text-gray-500 text-sm mb-1">賞味期限: {expires}</p>
              <p className="font-semibold">
                {priceAfter}円
                {discount > 0 && <span className="text-red-600 ml-1">({discount}%OFF)</span>}
              </p>
              <button
                type="button"
                onClick={() => handleAddCart(id)}
                className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                カートに追加
              </button>
            </div>
          );
        })}
      </div>
      {filteredProducts.length === 0 && q && (
        <p className="text-gray-500 mt-4">該当する商品がありません</p>
      )}
    </div>
  );
}
