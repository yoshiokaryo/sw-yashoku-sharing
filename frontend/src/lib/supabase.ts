import { createClient, type SupabaseClient, type Session } from "npm:@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? ""

let client: SupabaseClient | null = null

/**
 * Returns the Supabase client (browser/server). Uses SUPABASE_URL and SUPABASE_ANON_KEY.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set")
    }
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return client
}

/**
 * Gets the current session. Use for "is logged in" checks.
 */
export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await getSupabase().auth.getSession()
  return session
}

/**
 * Signs out the current user.
 */
export async function signOut(): Promise<void> {
  await getSupabase().auth.signOut()
}
