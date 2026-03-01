/**
 * 商品モックデータ（約20件）
 */
export type ProductRow = {
  Product?: { id?: string; name?: string; price?: number };
  Inventory?: { stock?: number; discount_rate?: number; expires_at?: string };
  Store?: { name?: string };
};

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const in2Days = new Date(now);
in2Days.setDate(in2Days.getDate() + 2);

function d(day: Date) {
  return day.toISOString().slice(0, 19).replace("T", " ");
}

export const mockProducts: ProductRow[] = [
  { Product: { id: "m1", name: "たまごサラダ", price: 198 }, Inventory: { stock: 5, discount_rate: 20, expires_at: d(tomorrow) }, Store: { name: "駅前キッチン" } },
  { Product: { id: "m2", name: "ポテトサラダ", price: 158 }, Inventory: { stock: 3, discount_rate: 30, expires_at: d(now) }, Store: { name: "駅前キッチン" } },
  { Product: { id: "m3", name: "コーンサラダ", price: 178 }, Inventory: { stock: 8, discount_rate: 10, expires_at: d(in2Days) }, Store: { name: "サンドイッチ工房" } },
  { Product: { id: "m4", name: "海藻サラダ", price: 128 }, Inventory: { stock: 12, discount_rate: 40, expires_at: d(tomorrow) }, Store: { name: "和惣菜 旬" } },
  { Product: { id: "m5", name: "チキンサンド", price: 298 }, Inventory: { stock: 4, discount_rate: 25, expires_at: d(tomorrow) }, Store: { name: "サンドイッチ工房" } },
  { Product: { id: "m6", name: "ツナサンド", price: 248 }, Inventory: { stock: 6, discount_rate: 15, expires_at: d(in2Days) }, Store: { name: "サンドイッチ工房" } },
  { Product: { id: "m7", name: "焼き立て食パン", price: 98 }, Inventory: { stock: 10, discount_rate: 50, expires_at: d(now) }, Store: { name: "駅前パン" } },
  { Product: { id: "m8", name: "クロワッサン", price: 128 }, Inventory: { stock: 7, discount_rate: 20, expires_at: d(tomorrow) }, Store: { name: "駅前パン" } },
  { Product: { id: "m9", name: "梅おにぎり", price: 120 }, Inventory: { stock: 15, discount_rate: 30, expires_at: d(now) }, Store: { name: "コンビニ惣菜" } },
  { Product: { id: "m10", name: "鮭おにぎり", price: 150 }, Inventory: { stock: 9, discount_rate: 25, expires_at: d(tomorrow) }, Store: { name: "コンビニ惣菜" } },
  { Product: { id: "m11", name: "唐揚げ（5個）", price: 350 }, Inventory: { stock: 2, discount_rate: 40, expires_at: d(now) }, Store: { name: "駅前キッチン" } },
  { Product: { id: "m12", name: "から揚げ弁当", price: 480 }, Inventory: { stock: 4, discount_rate: 35, expires_at: d(tomorrow) }, Store: { name: "駅前キッチン" } },
  { Product: { id: "m13", name: "焼き魚定食", price: 580 }, Inventory: { stock: 2, discount_rate: 30, expires_at: d(now) }, Store: { name: "和惣菜 旬" } },
  { Product: { id: "m14", name: "煮物三種盛り", price: 220 }, Inventory: { stock: 6, discount_rate: 20, expires_at: d(in2Days) }, Store: { name: "和惣菜 旬" } },
  { Product: { id: "m15", name: "フルーツ盛り合わせ", price: 398 }, Inventory: { stock: 3, discount_rate: 25, expires_at: d(tomorrow) }, Store: { name: "サンドイッチ工房" } },
  { Product: { id: "m16", name: "野菜スティック", price: 148 }, Inventory: { stock: 8, discount_rate: 15, expires_at: d(in2Days) }, Store: { name: "駅前キッチン" } },
  { Product: { id: "m17", name: "コロッケ（2個）", price: 180 }, Inventory: { stock: 5, discount_rate: 45, expires_at: d(now) }, Store: { name: "コンビニ惣菜" } },
  { Product: { id: "m18", name: "焼きそばパン", price: 168 }, Inventory: { stock: 4, discount_rate: 30, expires_at: d(tomorrow) }, Store: { name: "駅前パン" } },
  { Product: { id: "m19", name: "おでん（大）", price: 280 }, Inventory: { stock: 3, discount_rate: 20, expires_at: d(now) }, Store: { name: "和惣菜 旬" } },
  { Product: { id: "m20", name: "ミックスサラダ", price: 168 }, Inventory: { stock: 11, discount_rate: 35, expires_at: d(tomorrow) }, Store: { name: "駅前キッチン" } },
];

export function getMockProductsResponse(): { products: ProductRow[] } {
  return { products: mockProducts };
}

export function getMockProduct(id: string): ProductRow | null {
  return mockProducts.find((p) => p.Product?.id === id) ?? null;
}
