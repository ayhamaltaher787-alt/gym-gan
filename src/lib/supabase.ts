import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_CONFIGURED = Boolean(url && anonKey);

/**
 * Supabase client. `null` when env vars are missing (e.g. during local
 * exploration before you've hooked up the project). All code that uses this
 * must handle the null case with a clear message instead of crashing.
 */
export const supabase: SupabaseClient | null = SUPABASE_CONFIGURED
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export const SUPABASE_TABLE_PROGRAMS = "programs";
export const SUPABASE_BUCKET_PROGRAMS = "program-files";
export const SUPABASE_BUCKET_THUMBS = "program-thumbnails";

export interface SupabaseProgramRow {
  id: string;
  title: string;
  description: string;
  author: string;
  category: "spiel" | "lernen" | "ki" | "sonstiges";
  type: "scratch" | "web" | "game" | "other";
  file_name: string | null;
  file_size: number | null;
  file_mime: string | null;
  file_path: string | null; // Storage-Path (bucket-intern)
  thumbnail_path: string | null;
  created_at: string;
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase ist noch nicht konfiguriert. Trage VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in deine .env.local oder Vercel-Environment ein."
    );
    this.name = "SupabaseNotConfiguredError";
  }
}
