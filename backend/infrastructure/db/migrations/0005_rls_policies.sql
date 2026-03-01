-- 0005: RLS（Row Level Security）ポリシー
-- Supabase SQL エディタで実行すること（0004 の後に実行）

-- ========== profiles ==========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 認証ユーザーが自分自身の行のみ SELECT / UPDATE 可能（INSERT はトリガで実行）
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========== stores ==========
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- 全員（anon + authenticated）SELECT 可能
CREATE POLICY "stores_select_all"
  ON public.stores FOR SELECT
  TO public
  USING (true);

-- ========== products ==========
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_all"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- ========== inventory ==========
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_select_all"
  ON public.inventory FOR SELECT
  TO public
  USING (true);

-- ========== orders ==========
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 認証ユーザーが自分に紐づく注文のみ SELECT / INSERT 可能
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- status 更新用（必要に応じて）
CREATE POLICY "orders_update_own"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========== order_items ==========
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 自分が作成した注文の明細のみ SELECT 可能
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

-- 自分が作成した注文にのみ明細を INSERT 可能
CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
