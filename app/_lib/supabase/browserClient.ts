import { createBrowserClient } from '@supabase/ssr';

const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

let supabase: ReturnType<typeof createClient>;

export const getSupabase = () => {
  if (!supabase) {
    supabase = createClient();
  }

  return supabase;
}