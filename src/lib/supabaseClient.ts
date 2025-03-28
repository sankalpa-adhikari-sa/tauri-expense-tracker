import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseLocalUrl = import.meta.env.VITE_LOCAL_SUPABASE_URL;
const supabaseLocalAnonKey = import.meta.env.VITE_LOCAL_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabase = createClient(supabaseLocalUrl, supabaseLocalAnonKey);
