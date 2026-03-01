-- 0002: inventory テーブル作成
-- Supabase SQL エディタで実行すること（0001 の後に実行）

CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  discount_rate integer NOT NULL DEFAULT 0 CHECK (discount_rate >= 0 AND discount_rate <= 100),
  expires_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_expires_at ON public.inventory(expires_at);
CREATE INDEX IF NOT EXISTS idx_inventory_stock ON public.inventory(stock) WHERE stock > 0;

COMMENT ON TABLE public.inventory IS '在庫（1商品1レコード）';
