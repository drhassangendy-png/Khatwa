import { createClient } from '@supabase/supabase-js';
// One persistent PKCE client for login, callbacks, and account backups.
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
export const getSupabaseClient = () => supabase;
