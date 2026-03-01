import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * サーバー専用 Supabase クライアント（サービスロール）。
 * users テーブルへの upsert など、RLS を超えた操作に使用。
 */
export function getSupabaseServer() {
  if (!url || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for server operations");
  }
  return createClient(url, serviceKey);
}
