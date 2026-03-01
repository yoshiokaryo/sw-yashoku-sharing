-- 0006: stores / products / inventory の初期データ（任意）
-- Supabase SQL エディタで実行すること（0005 の後に実行）
-- 既にデータがある場合はスキップまたは条件付きで投入すること

-- 店舗（サンプル）
INSERT INTO public.stores (id, name, floor, section, created_at)
VALUES
  ('a0000000-0000-4000-8000-000000000001'::uuid, '学生食堂 本館', '1F', 'A', now()),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'カフェ サテライト', '2F', 'B', now())
ON CONFLICT (id) DO NOTHING;

-- 商品（サンプル）
INSERT INTO public.products (id, store_id, name, category, price, image_url, created_at)
VALUES
  ('b0000000-0000-4000-8000-000000000001'::uuid, 'a0000000-0000-4000-8000-000000000001'::uuid, '彩りサラダ', 'サラダ', 450, '', now()),
  ('b0000000-0000-4000-8000-000000000002'::uuid, 'a0000000-0000-4000-8000-000000000001'::uuid, '鮭の塩焼き定食', '賄い飯', 580, '', now()),
  ('b0000000-0000-4000-8000-000000000003'::uuid, 'a0000000-0000-4000-8000-000000000001'::uuid, '豚の生姜焼き定食', '賄い飯', 620, '', now()),
  ('b0000000-0000-4000-8000-000000000004'::uuid, 'a0000000-0000-4000-8000-000000000002'::uuid, '本日のパスタ', '賄い飯', 480, '', now()),
  ('b0000000-0000-4000-8000-000000000005'::uuid, 'a0000000-0000-4000-8000-000000000002'::uuid, 'フルーツサラダ', 'サラダ', 380, '', now())
ON CONFLICT (id) DO NOTHING;

-- 在庫（1商品1レコード。product_id が UNIQUE のため ON CONFLICT は product_id で行う）
INSERT INTO public.inventory (product_id, stock, discount_rate, expires_at, updated_at)
VALUES
  ('b0000000-0000-4000-8000-000000000001'::uuid, 10, 0, now() + interval '1 day', now()),
  ('b0000000-0000-4000-8000-000000000002'::uuid, 5, 20, now() + interval '2 hours', now()),
  ('b0000000-0000-4000-8000-000000000003'::uuid, 3, 30, now() + interval '3 hours', now()),
  ('b0000000-0000-4000-8000-000000000004'::uuid, 8, 10, now() + interval '5 hours', now()),
  ('b0000000-0000-4000-8000-000000000005'::uuid, 12, 0, now() + interval '1 day', now())
ON CONFLICT (product_id) DO UPDATE SET
  stock = EXCLUDED.stock,
  discount_rate = EXCLUDED.discount_rate,
  expires_at = EXCLUDED.expires_at,
  updated_at = EXCLUDED.updated_at;
