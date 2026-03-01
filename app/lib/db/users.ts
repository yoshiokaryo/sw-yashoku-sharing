import { getSupabaseServer } from "@/lib/supabase/server";

export type UserRow = {
  id: string;
  provider_id: string;
  email: string | null;
  name: string | null;
  image_url: string | null;
  display_name: string | null;
  allergies: string[];
  created_at: string;
  updated_at: string;
};

/**
 * provider_id（Google sub）でユーザーを検索し、いなければ登録・あれば更新して id (uuid) を返す。
 * ログイン時・登録時に呼び、users テーブルに情報があるか確かめる（upsert）。
 */
export async function upsertUserByProvider(providerId: string, data: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}): Promise<string | null> {
  const supabase = getSupabaseServer();
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("provider_id", providerId)
    .single();

  const row = {
    provider_id: providerId,
    email: data.email ?? null,
    name: data.name ?? null,
    image_url: data.image ?? null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    await supabase.from("users").update(row).eq("id", existing.id);
    return existing.id;
  }

  const { data: inserted, error } = await supabase
    .from("users")
    .insert({ ...row, created_at: new Date().toISOString() })
    .select("id")
    .single();

  if (error || !inserted?.id) return null;
  return inserted.id;
}
