-- アプリ用 users テーブル（Auth.js / Google ログイン時に登録）
-- Supabase の SQL エディタで実行してください。

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id text NOT NULL UNIQUE,
  email text,
  name text,
  image_url text,
  display_name text,
  allergies text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_provider_id ON public.users (provider_id);

COMMENT ON TABLE public.users IS 'Auth.js (Google) でログインしたユーザー。登録・ログイン時に upsert される。';

-- RLS: アプリがサービスロールで users を upsert。anon は INSERT/UPDATE/DELETE 不可。
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 一覧取得用（API で user_id で絞る想定）。必要なら制限を強める。
CREATE POLICY "users_select"
  ON public.users FOR SELECT
  USING (true);

-- 注文テーブルが users.id を参照する場合用（既に orders がある場合は必要に応じて ALTER）
-- ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
-- ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey
--   FOREIGN KEY (user_id) REFERENCES public.users(id);
