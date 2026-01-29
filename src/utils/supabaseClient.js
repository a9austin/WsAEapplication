import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Set these environment variables in your Vercel project settings:
//   VITE_SUPABASE_URL = your Supabase project URL
//   VITE_SUPABASE_ANON_KEY = your Supabase anon/public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if credentials are configured
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function isSupabaseConfigured() {
  return supabase !== null;
}
