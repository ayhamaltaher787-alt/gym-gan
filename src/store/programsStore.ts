import { create } from "zustand";
import {
  supabase,
  SUPABASE_BUCKET_PROGRAMS,
  SUPABASE_BUCKET_THUMBS,
  SUPABASE_CONFIGURED,
  SUPABASE_TABLE_PROGRAMS,
  SupabaseNotConfiguredError,
  type SupabaseProgramRow,
} from "../lib/supabase";

export type ProgramCategory = "spiel" | "lernen" | "ki" | "sonstiges";
export type ProgramType = "scratch" | "web" | "game" | "other";

export interface ProgramFileRef {
  name: string;
  size: number;
  mime: string;
  /**
   * Public URL served by Supabase Storage. Available as soon as the row is
   * loaded – users can download / play the file from here.
   */
  publicUrl?: string;
  /** Storage path (bucket-internal) – used for delete. */
  storagePath?: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  author: string;
  category: ProgramCategory;
  type: ProgramType;
  file?: ProgramFileRef;
  thumbnail?: string; // Public URL
  thumbnailStoragePath?: string;
  createdAt: string;
}

export interface NewProgramInput {
  title: string;
  description: string;
  author: string;
  category: ProgramCategory;
  type: ProgramType;
  file?: File | null;
  thumbnail?: File | null;
}

interface ProgramsState {
  programs: ProgramItem[];
  loading: boolean;
  error: string | null;
  loadedOnce: boolean;
  refresh: () => Promise<void>;
  addProgram: (input: NewProgramInput) => Promise<ProgramItem>;
  removeProgram: (id: string) => Promise<void>;
}

function requireClient() {
  if (!supabase) throw new SupabaseNotConfiguredError();
  return supabase;
}

function rowToItem(row: SupabaseProgramRow): ProgramItem {
  const client = supabase;
  const filePublicUrl =
    row.file_path && client
      ? client.storage.from(SUPABASE_BUCKET_PROGRAMS).getPublicUrl(row.file_path).data
          .publicUrl
      : undefined;
  const thumbPublicUrl =
    row.thumbnail_path && client
      ? client.storage.from(SUPABASE_BUCKET_THUMBS).getPublicUrl(row.thumbnail_path).data
          .publicUrl
      : undefined;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    author: row.author,
    category: row.category,
    type: row.type,
    createdAt: row.created_at,
    file: row.file_path
      ? {
          name: row.file_name ?? "programm.sb3",
          size: row.file_size ?? 0,
          mime: row.file_mime ?? "application/octet-stream",
          publicUrl: filePublicUrl,
          storagePath: row.file_path,
        }
      : undefined,
    thumbnail: thumbPublicUrl,
    thumbnailStoragePath: row.thumbnail_path ?? undefined,
  };
}

function makeStoragePath(programId: string, filename: string) {
  const safe = filename.replace(/[^\w.\-]+/g, "_");
  return `${programId}/${Date.now()}-${safe}`;
}

export const useProgramsStore = create<ProgramsState>((set, get) => ({
  programs: [],
  loading: false,
  error: null,
  loadedOnce: false,

  refresh: async () => {
    if (!SUPABASE_CONFIGURED) {
      set({
        error:
          "Supabase ist noch nicht verbunden. Trage die Umgebungsvariablen (siehe .env.example) ein.",
        loading: false,
        loadedOnce: true,
      });
      return;
    }
    const client = requireClient();
    set({ loading: true, error: null });
    const { data, error } = await client
      .from(SUPABASE_TABLE_PROGRAMS)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      set({ error: error.message, loading: false, loadedOnce: true });
      return;
    }
    const items = (data as SupabaseProgramRow[]).map(rowToItem);
    set({ programs: items, loading: false, loadedOnce: true });
  },

  addProgram: async (input) => {
    const client = requireClient();
    const id = crypto.randomUUID();

    let filePath: string | null = null;
    let thumbPath: string | null = null;

    if (input.file) {
      filePath = makeStoragePath(id, input.file.name);
      const { error: upErr } = await client.storage
        .from(SUPABASE_BUCKET_PROGRAMS)
        .upload(filePath, input.file, {
          upsert: false,
          contentType: input.file.type || "application/octet-stream",
        });
      if (upErr) throw new Error(`Datei-Upload fehlgeschlagen: ${upErr.message}`);
    }

    if (input.thumbnail) {
      thumbPath = makeStoragePath(id, input.thumbnail.name);
      const { error: thErr } = await client.storage
        .from(SUPABASE_BUCKET_THUMBS)
        .upload(thumbPath, input.thumbnail, {
          upsert: false,
          contentType: input.thumbnail.type || "image/*",
        });
      if (thErr) {
        // roll back file upload
        if (filePath) {
          await client.storage.from(SUPABASE_BUCKET_PROGRAMS).remove([filePath]);
        }
        throw new Error(`Vorschaubild-Upload fehlgeschlagen: ${thErr.message}`);
      }
    }

    const row: SupabaseProgramRow = {
      id,
      title: input.title,
      description: input.description,
      author: input.author,
      category: input.category,
      type: input.type,
      file_name: input.file?.name ?? null,
      file_size: input.file?.size ?? null,
      file_mime: input.file?.type || null,
      file_path: filePath,
      thumbnail_path: thumbPath,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from(SUPABASE_TABLE_PROGRAMS)
      .insert(row)
      .select("*")
      .single();

    if (error || !data) {
      // roll back uploads
      if (filePath) {
        await client.storage.from(SUPABASE_BUCKET_PROGRAMS).remove([filePath]);
      }
      if (thumbPath) {
        await client.storage.from(SUPABASE_BUCKET_THUMBS).remove([thumbPath]);
      }
      throw new Error(`Programm konnte nicht gespeichert werden: ${error?.message ?? "unbekannt"}`);
    }

    const item = rowToItem(data as SupabaseProgramRow);
    set({ programs: [item, ...get().programs] });
    return item;
  },

  removeProgram: async (id) => {
    const client = requireClient();
    const item = get().programs.find((p) => p.id === id);
    if (!item) return;

    if (item.file?.storagePath) {
      await client.storage.from(SUPABASE_BUCKET_PROGRAMS).remove([item.file.storagePath]);
    }
    if (item.thumbnailStoragePath) {
      await client.storage.from(SUPABASE_BUCKET_THUMBS).remove([item.thumbnailStoragePath]);
    }
    const { error } = await client.from(SUPABASE_TABLE_PROGRAMS).delete().eq("id", id);
    if (error) throw new Error(`Löschen fehlgeschlagen: ${error.message}`);

    set({ programs: get().programs.filter((p) => p.id !== id) });
  },
}));
