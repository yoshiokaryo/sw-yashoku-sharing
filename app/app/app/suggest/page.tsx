"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { suggest as suggestApi } from "@/lib/api";
import { addToCart } from "@/lib/cart";

type Suggestion = { product_id: string; name?: string; reason?: string; discount_rate?: number; price_after_discount?: number };

export default function SuggestPage() {
  const router = useRouter();
  const [mood, setMood] = useState("");
  const [allergiesStr, setAllergiesStr] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<Suggestion[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setList([]);
    const allergies = allergiesStr ? allergiesStr.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
    const budgetNum = parseInt(budget, 10) || 0;
    try {
      const res = await suggestApi({ mood, allergies, budget: budgetNum });
      if (res && typeof res === "object" && "_unauthorized" in res) {
        router.replace("/auth/login");
        return;
      }
      const data = res as { suggestions?: Suggestion[] };
      setList(data?.suggestions ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCart = (id: string) => {
    addToCart(id, 1);
    alert("カートに追加しました");
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-xl font-bold mb-4">AI提案</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <label>
          <span className="block text-sm font-medium mb-1">今日の気分</span>
          <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="例: さっぱりしたものが食べたい" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </label>
        <label>
          <span className="block text-sm font-medium mb-1">アレルギー・避けたい食材（カンマ区切り）</span>
          <input type="text" value={allergiesStr} onChange={(e) => setAllergiesStr(e.target.value)} placeholder="例: 卵, 乳" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </label>
        <label>
          <span className="block text-sm font-medium mb-1">予算（円）</span>
          <input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="例: 1500" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </label>
        <button type="submit" disabled={loading} className="py-3 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-60">
          {loading ? "取得中…" : "提案をもらう"}
        </button>
      </form>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="space-y-3">
        {list.length === 0 && !loading && <p className="text-gray-500">提案はありません</p>}
        {list.map((s) => (
          <div key={s.product_id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-semibold mb-1">{s.name ?? ""}</h3>
            <p className="text-gray-500 text-sm mb-2">{s.reason ?? ""}</p>
            <p className="mb-2">
              {s.price_after_discount ?? 0}円
              {s.discount_rate ? ` (${s.discount_rate}%OFF)` : ""}
            </p>
            <button type="button" onClick={() => handleAddCart(s.product_id)} className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm">
              カートに追加
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
