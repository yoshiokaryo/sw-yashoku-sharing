-- 0003: profiles テーブル作成 + auth.users 連動トリガ
-- Supabase SQL エディタで実行すること（0002 の後に実行）
-- profiles.id は auth.users.id と一致させる

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT '',
  allergies text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS '認証ユーザーと1:1のプロファイル（学生向け追加情報）';

-- auth.users 作成時に profiles に1行挿入するトリガ
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, allergies, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), ''),
    '{}',
    now(),
    now()
  );
  RETURN NEW;
END;
$$;

-- 既存のトリガがあれば削除してから作成（冪等）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
