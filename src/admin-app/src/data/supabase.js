/**
 * @file supabase.js
 * @summary Singleton Supabase client used by the data layer.
 *
 * Reads the URL and anon key from Vite environment variables and throws
 * on import if either is missing -- failing fast at startup is better
 * than letting individual queries 401 mysteriously at runtime.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
