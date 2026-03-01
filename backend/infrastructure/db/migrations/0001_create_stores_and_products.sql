-- 0001: stores と products テーブル作成
-- Supabase SQL エディタで実行すること

-- stores: 店舗（商品の所属先）
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  floor text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- products: 商品マスタ（サラダ・賄い飯など）
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  price integer NOT NULL CHECK (price >= 0),
  image_url text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 検索・JOIN 用インデックス
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

COMMENT ON TABLE public.stores IS '店舗（コンテスト用にシード投入）';
COMMENT ON TABLE public.products IS '商品マスタ';
